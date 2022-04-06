import { KakaoChatResModel, QuickReplyModel } from "../models/kakaochat.model";
import { getManager, getConnection } from 'typeorm'
import { ChatUser } from "../orm/entities/ChatUser";
import logger from "../logger";
import { NextBlockModel } from "../models/runtime.model";
import { ChatFallback } from "../orm/entities/ChatFallback";
import { ChatFallbackRecommend } from "../orm/entities/ChatFallbackRecommend";
import { BLOCK_ID_FALLBACK } from "../types/global.types";
import { ChatLog } from "../orm/entities/ChatLog";

export function returnErrorMessage(message: string = '오류가 발생하였습니다.'): KakaoChatResModel {
    return {
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: {
                        text: message
                    }
                }
            ],
            quickReplies: [
                {
                    messageText: "홈으로 이동",
                    action: "message",
                    label: "홈"
                }
            ]
        }
    }
}

export function returnRecommendedMessage(recommendNextBlockList: NextBlockModel[]): KakaoChatResModel {
    const returnMsg = {
        version: "2.0",
        template: {
            outputs: [
                {
                    simpleText: {
                        text: '잘 이해하지 못 했습니다.\n이걸 원하셨나요?'
                    }
                }
            ],
            quickReplies: [
            ] as QuickReplyModel[]
        }
    }

    returnMsg.template.quickReplies = recommendNextBlockList.map(item => {
        return {
            ...item.quickReply
        } as QuickReplyModel;
    })
    return returnMsg
}

export async function getRecentUserState(userkey: string): Promise<{blockID: string, inputMsg: string | null }> {

    let lastBlockId = 'intro'

    logger.debug(`[runtimeHandler] [getRecentUserState] userkey: ${userkey}`)

    const connection = getConnection();

    try {
        const chatUserRepo = await connection.getRepository(ChatUser)
        const chatUser = await chatUserRepo.findOne({userkey})

        if (chatUser) {
            logger.debug(`[runtimeHandler] [getRecentUserState] userkey: ${userkey}, last block: ${chatUser.currentBlockId}`)
            return Promise.resolve({
                blockID: chatUser.currentBlockId,
                inputMsg: chatUser.lastInputMsg
            });
        }
        throw new Error(`Not exist userkey ${userkey}`)
    } catch (err: any) {
        logger.error(`[runtimeHandler] [getRecentUserState] userkey: ${userkey} error: ${err.message}`)
        return Promise.resolve({
            blockID: lastBlockId,
            inputMsg: null
        })
    }
}

export async function writeFallbackEscapeLog(userKey: string, selectedRecommendedBlockId: string) {
    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner()
    const queryBuilder = await connection.createQueryBuilder(ChatFallback, 'test', queryRunner);
    try {
        await queryRunner.startTransaction()

        logger.debug(`[runtimeHandler] [writeFallbackEscapeLog] Fallback escape log for ${userKey}`)
        const fallback = await queryBuilder.select([
            '_ChatFallback.fallbackId',
            '_ChatFallback.userKey',
            '_ChatFallback.cameFromBlockId',
            '_ChatFallback.inputMsg',
            '_ChatFallback.registerDatetime',
        ])
        .from(ChatFallback, '_ChatFallback')
        .where('_ChatFallback.userKey = :userKey', {userKey})
        .getOne()

        if (!fallback) {
            logger.error(`[runtimeHandler] [writeFallbackEscapeLog] User ${userKey}, is not in fallback`)
            throw new Error(`User ${userKey}, is not in fallback`)
        }

        logger.debug(`[runtimeHandler] [writeFallbackEscapeLog] Fallback id: ${fallback.fallbackId}`)

        await queryBuilder.insert()
        .into(ChatLog)
        .values([
            {
                userKey: fallback.userKey,
                lastBlockId: fallback.cameFromBlockId,
                selectedRecommendedBlockId,
                msg: fallback.inputMsg || undefined
            }
        ]).execute()

        await queryBuilder.delete()
        .from(ChatFallback)
        .where('userKey = :userKey', {userKey})
        .execute()
        
        await queryRunner.commitTransaction();

        logger.debug(`[runtimeHandler] [writeFallbackEscapeLog] transaction committed`)
    } catch(err: any) {
        logger.error(`[runtimeHandler] [writeFallbackEscapeLog] transaction rollback: ${err.message}`)
        await queryRunner.rollbackTransaction();
    } finally {
        logger.info(`[runtimeHandler] [writeFallbackEscapeLog] transaction done.`)
        await queryRunner.release();
    }
}

export async function openFallbackBlock(userKey: string, cameBlockID: string, recommendNextBlockList: NextBlockModel[], messageText: string) {

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner()
    const queryBuilder = await connection.createQueryBuilder(ChatUser, 'test', queryRunner);
    // https://stackoverflow.com/a/47064558/7270469
    await queryRunner.startTransaction()
    try {

        let fallbackID = 0
        if (cameBlockID !== BLOCK_ID_FALLBACK) {
            logger.info(`[runtimeHandler] [openFallbackBlock] new fallback start`)
            const result = await queryBuilder.insert()
            .into(ChatFallback)
            .values([
                {
                    userKey,
                    cameFromBlockId: cameBlockID,
                    inputMsg: messageText
                }
            ]).execute()
            fallbackID = result.raw.insertId
        } else {
            logger.info(`[runtimeHandler] [openFallbackBlock] continue fallback`)
            const result = await queryBuilder.select([
                '_ChatUser.fallbackId'
            ])
            .from(ChatUser, '_ChatUser')
            .where('_ChatUser.userkey = :userKey', {userKey})
            .getOne()

            if (result && result.fallbackId) {
                fallbackID = result.fallbackId

                await queryBuilder.update(ChatFallback)
                .set({
                    inputMsg: messageText
                })
                .where('fallbackId = :fallbackID', {fallbackID})
                .execute()

                await queryBuilder.delete()
                .from(ChatFallbackRecommend)
                .where('fallbackId = :fallbackId', {fallbackId: fallbackID})
                .execute()
            } else {
                // logger.warn(`[runtimeHandler] [openFallbackBlock] user not found or fallback id not found`)
                throw new Error(`user not found or fallback id not found`)
            }
        }

        logger.debug(`[runtimeHandler] [openFallbackBlock] fallback idx: ${fallbackID}`)

        await queryBuilder.insert()
        .into(ChatFallbackRecommend)
        .values(recommendNextBlockList.map(item => {

            logger.debug(`[runtimeHandler] [openFallbackBlock] fallback id: ${fallbackID} / block link id: ${item.blockLinkedID}`)
            return {
                fallbackId: fallbackID,
                blockLinkId: item.blockLinkedID
                // blockRuntimeId: 
            } as ChatFallbackRecommend
        }))
        .execute()

        await queryBuilder.update(ChatUser)
        .set({
            fallbackId: fallbackID,
            updateDatetime: 'current_timestamp()'
        })
        .where("userkey = :userKey", { userKey })
        .execute()

        logger.info(`[runtimeHandler] [openFallbackBlock] userkey: ${userKey} fallback idx updated: ${fallbackID}`)

        await queryRunner.commitTransaction();

        logger.debug(`[runtimeHandler] [openFallbackBlock] userkey: ${userKey} / ${cameBlockID} transaction committed`)
    } catch(err: any) {
        logger.error(`[runtimeHandler] [openFallbackBlock] userkey: ${userKey} / ${cameBlockID} transaction rollback: ${err.message}`)
        await queryRunner.rollbackTransaction();
    } finally {
        logger.info(`[runtimeHandler] [openFallbackBlock] userkey: ${userKey} / ${cameBlockID} transaction done.`)
        await queryRunner.release();
    }
}

export async function updateUserState(userkey: string, blockID: string, inputMsg: string) {

    logger.debug(`[runtimeHandler] [updateUserState] userkey: ${userkey}, set blockID: ${blockID}`)

    const connection = getConnection();
    const queryRunner = await connection.createQueryRunner()
    const queryBuilder = await connection.createQueryBuilder(ChatUser, 'test', queryRunner);
    // https://stackoverflow.com/a/47064558/7270469
    await queryRunner.startTransaction()
    
    try {
        logger.debug(`[runtimeHandler] [updateUserState] userkey: ${userkey} start transaction`)
        
        const chatUserRepo = await connection.getRepository(ChatUser)
        const isExistUser = await chatUserRepo.findOne({userkey: userkey})

        if (isExistUser) {
            logger.debug(`[runtimeHandler] [updateUserState] userkey: ${userkey} already exist`)
            await queryBuilder.update()
            .set({
                currentBlockId: blockID,
                lastBlockId: isExistUser.currentBlockId,
                lastInputMsg: inputMsg,
                updateDatetime: 'current_timestamp()'
            })
            .where("userkey = :userkey", { userkey })
            .execute();
        } else {
            logger.debug(`[runtimeHandler] [updateUserState] userkey: ${userkey} newbie`)
            await queryBuilder.insert().into(ChatUser).values([
                { userkey, currentBlockId: blockID }
            ])
            .execute();
        }

        await queryRunner.commitTransaction();

        logger.debug(`[runtimeHandler] [updateUserState] userkey: ${userkey} transaction committed`)
    } catch(err: any) {
        logger.error(`[runtimeHandler] [updateUserState] userkey: ${userkey} transaction rollback: ${err.message}`)
        await queryRunner.rollbackTransaction();
    } finally {
        logger.info(`[runtimeHandler] [updateUserState] userkey: ${userkey} transaction done.`)
        await queryRunner.release();
    }
}