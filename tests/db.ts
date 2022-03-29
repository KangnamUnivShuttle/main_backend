import { createConnection, getConnection } from 'typeorm';
import { ChatBlock } from '../src/orm/entities/ChatBlock';
import { ChatBlockLink } from '../src/orm/entities/ChatBlockLink';
import { ChatBlockRuntime } from '../src/orm/entities/ChatBlockRuntime';
import { ChatImage } from '../src/orm/entities/ChatImage';
import {ormconfig} from './global';

// delete from chat_image;
// delete from chat_block;
// delete from chat_block_link;
// delete from chat_block_runtime;

// insert into chat_image(imageID, name, order_num, github_url) values (1, 'test1-1', 1, 'url'), (2, 'test1-2', 2, 'url'), (3, 'test2-1', 3, 'url');
// insert into chat_block(blockID, name, order_num, enabled) VALUES('intro', 'intro', 1, 1), ('hello', 'hello world', 2, 1);
// insert into chat_block_link(blockLinkID, blockID, order_num, nextBlockID, label) VALUES(1, 'intro', 1, 'hello', 'go to hello'), (2, 'intro', 1, 'intro', 'go to intro'), (3, 'hello', 3, 'intro', 'go to intro from hello');
// insert into chat_block_runtime (blockRuntimeID, blockID, imageID, order_num) values (1, 'intro', 1, 1), (2, 'intro', 2, 2), (3, 'hello', 3, 3);

export async function resetRuntimeTestData() {
    await resetRuntimeTestData_ChatBlockRuntime();
    await resetRuntimeTestData_ChatImage();
    await resetRuntimeTestData_ChatBlock();
    await resetRuntimeTestData_ChatBlockLink();
    return Promise.resolve(true);
}

export async function insertRuntimeTestData() {
    await insertRuntimeTestData_ChatImage();
    await insertRuntimeTestData_ChatBlock();
    await insertRuntimeTestData_ChatBlockLink();
    await insertRuntimeTestData_ChatBlockRuntime();
    return Promise.resolve(true);
}

async function dbConnection() {
    if (getConnection()) {
        return Promise.resolve(getConnection())
    }
    return createConnection(ormconfig);
}

export async function resetRuntimeTestData_ChatImage() {
    const connection = await dbConnection()
    const queryRunner = await connection.createQueryRunner()
    try {
        const queryBuilder = await connection.createQueryBuilder(ChatImage, 'registerPlugin', queryRunner);
        await queryRunner.startTransaction()

        queryBuilder.delete()
            .from(ChatImage)
            .execute()
        
        await queryRunner.commitTransaction();
        console.debug(`[DB-Test] [resetRuntimeTestData_ChatImage] ok`)
        
    } catch (err: any) {
        await queryRunner.rollbackTransaction();
        console.error(`[DB-Test] [resetRuntimeTestData_ChatImage] err ${err.message}`)
        throw err
    } finally {
        await queryRunner.release();
        console.info(`[DB-Test] [resetRuntimeTestData_ChatImage] done`)
    }

    return Promise.resolve();
}

export async function resetRuntimeTestData_ChatBlock() {
    const connection = await dbConnection()
    const queryRunner = await connection.createQueryRunner()
    try {
        const queryBuilder = await connection.createQueryBuilder(ChatBlock, 'registerPlugin', queryRunner);
        await queryRunner.startTransaction()
        
        queryBuilder.delete()
            .from(ChatBlock)
            .execute()
        
        await queryRunner.commitTransaction();
        console.debug(`[DB-Test] [resetRuntimeTestData_ChatBlock] ok`)
    } catch (err: any) {
        await queryRunner.rollbackTransaction();
        console.error(`[DB-Test] [resetRuntimeTestData_ChatBlock] err ${err.message}`)
        throw err
    } finally {
        await queryRunner.release();
        console.info(`[DB-Test] [resetRuntimeTestData_ChatBlock] done`)
    }

    return Promise.resolve();
}

export async function resetRuntimeTestData_ChatBlockLink() {
    const connection = await dbConnection()
    const queryRunner = await connection.createQueryRunner()
    try {
        const queryBuilder = await connection.createQueryBuilder(ChatBlockLink, 'registerPlugin', queryRunner);
        await queryRunner.startTransaction()

        queryBuilder.delete()
            .from(ChatBlockLink)
            .execute()
        
        await queryRunner.commitTransaction();
        console.debug(`[DB-Test] [resetRuntimeTestData_ChatBlockLink] ok`)
    } catch (err: any) {
        await queryRunner.rollbackTransaction();
        console.error(`[DB-Test] [resetRuntimeTestData_ChatBlockLink] err ${err.message}`)
        throw err
    } finally {
        await queryRunner.release();
        console.info(`[DB-Test] [resetRuntimeTestData_ChatBlockLink] done`)
    }

    return Promise.resolve();
}

export async function resetRuntimeTestData_ChatBlockRuntime() {
    const connection = await dbConnection()
    const queryRunner = await connection.createQueryRunner()
    try {
        const queryBuilder = await connection.createQueryBuilder(ChatBlockRuntime, 'registerPlugin', queryRunner);
        await queryRunner.startTransaction()

        queryBuilder.delete()
            .from(ChatBlockRuntime)
            .execute()
        
        await queryRunner.commitTransaction();
        console.debug(`[DB-Test] [resetRuntimeTestData_ChatBlockRuntime] ok`)
    } catch (err: any) {
        await queryRunner.rollbackTransaction();
        console.error(`[DB-Test] [resetRuntimeTestData_ChatBlockRuntime] err ${err.message}`)
        throw err
    } finally {
        await queryRunner.release();
        console.info(`[DB-Test] [resetRuntimeTestData_ChatBlockRuntime] done`)
    }

    return Promise.resolve();
}

export async function insertRuntimeTestData_ChatImage() {
    const connection = await dbConnection()
    const queryRunner = await connection.createQueryRunner()
    try {
        const queryBuilder = await connection.createQueryBuilder(ChatImage, 'registerPlugin', queryRunner);
        await queryRunner.startTransaction()
        // insert into chat_image(imageID, name, order_num, github_url) values (1, 'test1-1', 1, 'url'), (2, 'test1-2', 2, 'url'), (3, 'test2-1', 3, 'url');
        queryBuilder.insert()
        .into(ChatImage)
        .values([
            {
                imageId: 1,
                name: 'toss',
                orderNum: 1,
                githubUrl: 'https://github.com/KangnamUnivShuttle/plugin_simple_toss.git'
            },
            {
                imageId: 2,
                name: 'weather',
                orderNum: 2,
                githubUrl: 'https://github.com/KangnamUnivShuttle/plugin_weather.git'
            },
            {
                imageId: 3,
                name: 'toss2',
                orderNum: 3,
                githubUrl: 'https://github.com/KangnamUnivShuttle/plugin_simple_toss.git'
            }
        ])
        .execute();

        await queryRunner.commitTransaction();
        console.debug(`[DB-Test] [insertRuntimeTestData_ChatImage] ok`)
    } catch (err: any) {
        await queryRunner.rollbackTransaction();
        console.error(`[DB-Test] [insertRuntimeTestData_ChatImage] err ${err.message}`)
        throw err
    } finally {
        await queryRunner.release();
        console.info(`[DB-Test] [insertRuntimeTestData_ChatImage] done`)
    }

    return Promise.resolve();
}

export async function insertRuntimeTestData_ChatBlock() {
    const connection = await dbConnection()
    const queryRunner = await connection.createQueryRunner()
    try {
        const queryBuilder = await connection.createQueryBuilder(ChatBlock, 'registerPlugin', queryRunner);
        await queryRunner.startTransaction()
        // insert into chat_block(blockID, name, order_num, enabled) VALUES('intro', 'intro', 1, 1), ('hello', 'hello world', 2, 1);
        queryBuilder.insert()
        .into(ChatBlock)
        .values([
            {
                blockId: 'intro',
                name: 'intro block',
                orderNum: 1,
                enabled: 1
            },
            {
                blockId: 'simple_weather',
                name: 'weather block',
                orderNum: 2,
                enabled: 1
            }
        ])
        .execute();

        await queryRunner.commitTransaction();
        console.debug(`[DB-Test] [insertRuntimeTestData_ChatBlock] ok`)
    } catch (err: any) {
        await queryRunner.rollbackTransaction();
        console.error(`[DB-Test] [insertRuntimeTestData_ChatBlock] err ${err.message}`)
        throw err
    } finally {
        await queryRunner.release();
        console.info(`[DB-Test] [insertRuntimeTestData_ChatBlock] done`)
    }

    return Promise.resolve();
}

export async function insertRuntimeTestData_ChatBlockLink() {
    const connection = await dbConnection()
    const queryRunner = await connection.createQueryRunner()
    try {
        const queryBuilder = await connection.createQueryBuilder(ChatBlockLink, 'registerPlugin', queryRunner);
        await queryRunner.startTransaction()
        // insert into chat_block_link(blockLinkID, blockID, order_num, nextBlockID, label) VALUES(1, 'intro', 1, 'hello', 'go to hello'), (2, 'intro', 1, 'intro', 'go to intro'), (3, 'hello', 3, 'intro', 'go to intro from hello');
        queryBuilder.insert()
        .into(ChatBlockLink)
        .values([
            {
                blockLinkId: 1,
                blockId: 'intro',
                orderNum: 2,
                nextBlockId: 'simple_weather',
                label: '날씨',
                messageText: '날씨를 알려줘'
            },
            {
                blockLinkId: 2,
                blockId: 'intro',
                orderNum: 1,
                nextBlockId: 'intro',
                label: '안녕',
                messageText: '안녕'
            },
            {
                blockLinkId: 3,
                blockId: 'simple_weather',
                orderNum: 1,
                nextBlockId: 'intro',
                label: '홈',
                messageText: '홈으로'
            }
        ])
        .execute();

        await queryRunner.commitTransaction();
        console.debug(`[DB-Test] [insertRuntimeTestData_ChatBlockLink] ok`)
    } catch (err: any) {
        await queryRunner.rollbackTransaction();
        console.error(`[DB-Test] [insertRuntimeTestData_ChatBlockLink] err ${err.message}`)
        throw err
    } finally {
        await queryRunner.release();
        console.info(`[DB-Test] [insertRuntimeTestData_ChatBlockLink] done`)
    }

    return Promise.resolve();
}

export async function insertRuntimeTestData_ChatBlockRuntime() {
    const connection = await dbConnection()
    const queryRunner = await connection.createQueryRunner()
    try {
        const queryBuilder = await connection.createQueryBuilder(ChatBlockRuntime, 'registerPlugin', queryRunner);
        await queryRunner.startTransaction()
        // insert into chat_block_runtime (blockRuntimeID, blockID, imageID, order_num) values (1, 'intro', 1, 1), (2, 'intro', 2, 2), (3, 'hello', 3, 3);
        queryBuilder.insert()
        .into(ChatBlockRuntime)
        .values([
            {
                blockRuntimeId: 1,
                blockId: 'intro',
                imageId: 1,
                orderNum: 1,
            },
            {
                blockRuntimeId: 2,
                blockId: 'simple_weather',
                imageId: 2,
                orderNum: 1,
            }
        ])
        .execute();

        await queryRunner.commitTransaction();
        console.debug(`[DB-Test] [insertRuntimeTestData_ChatBlockRuntime] ok`)
    } catch (err: any) {
        await queryRunner.rollbackTransaction();
        console.error(`[DB-Test] [insertRuntimeTestData_ChatBlockRuntime] err ${err.message}`)
        throw err
    } finally {
        await queryRunner.release();
        console.info(`[DB-Test] [insertRuntimeTestData_ChatBlockRuntime] done`)
    }

    return Promise.resolve();
}