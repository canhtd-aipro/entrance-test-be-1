import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabase1776407451313 implements MigrationInterface {
    name = "InitialDatabase1776407451313";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(),
                "name" text NOT NULL,
                "priority" smallint NOT NULL,
                CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "todos" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(),
                "name" text NOT NULL,
                "description" text,
                "deadline" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_ca8cafd59ca6faaf67995344225" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "todo_categories" (
                "categoryId" integer NOT NULL,
                "todoId" integer NOT NULL,
                CONSTRAINT "PK_64846b78ab831ce74412525e0d1" PRIMARY KEY ("categoryId", "todoId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_42f11d41806f5651b92fd3628f" ON "todo_categories" ("categoryId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_4d84a8d0778b2b8d753f6d396d" ON "todo_categories" ("todoId")
        `);
        await queryRunner.query(`
            ALTER TABLE "todo_categories"
            ADD CONSTRAINT "FK_42f11d41806f5651b92fd3628f9" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "todo_categories"
            ADD CONSTRAINT "FK_4d84a8d0778b2b8d753f6d396d9" FOREIGN KEY ("todoId") REFERENCES "todos"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "todo_categories" DROP CONSTRAINT "FK_4d84a8d0778b2b8d753f6d396d9"
        `);
        await queryRunner.query(`
            ALTER TABLE "todo_categories" DROP CONSTRAINT "FK_42f11d41806f5651b92fd3628f9"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_4d84a8d0778b2b8d753f6d396d"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_42f11d41806f5651b92fd3628f"
        `);
        await queryRunner.query(`
            DROP TABLE "todo_categories"
        `);
        await queryRunner.query(`
            DROP TABLE "todos"
        `);
        await queryRunner.query(`
            DROP TABLE "categories"
        `);
    }
}
