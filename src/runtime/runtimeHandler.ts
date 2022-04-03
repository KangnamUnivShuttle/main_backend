import { KakaoChatResModel } from "../models/kakaochat.model";
import { getManager, getConnection } from 'typeorm'
import { ChatUser } from "../orm/entities/ChatUser";
import logger from "../logger";

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

export function returnRecommendedMessage(): KakaoChatResModel {
    return {

    } as KakaoChatResModel
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

export async function writeFallbackLog(fromBlockID: string, selectedBlockID: string, ) {
    
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