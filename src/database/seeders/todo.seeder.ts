import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { Priority } from "../../enums/priority.enum";
import "../../utils/concurrent.util";
import { CategoryEntity } from "../entities/category.entity";
import { TodoEntity } from "../entities/todo.entity";
import { datetime } from "../../utils/datetime.util";

export class TodoSeeder implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    return connection.transaction(async (manager) => {
      const categoryRepo = manager.getRepository(CategoryEntity);
      const todoRepo = manager.getRepository(TodoEntity);

      const categories: Record<string, Partial<CategoryEntity>> = {
        1: { name: "A", priority: Priority.Low },
        2: { name: "B", priority: Priority.Medium },
        3: { name: "C", priority: Priority.High },
        4: { name: "D", priority: Priority.Low },
        5: { name: "E", priority: Priority.Medium },
        6: { name: "F", priority: Priority.High },
        7: { name: "G", priority: Priority.Low },
        8: { name: "H", priority: Priority.Medium },
        9: { name: "I", priority: Priority.High },
      };

      const todos: Array<Partial<TodoEntity> & { categoryKeys: number[] }> = [
        { name: "Todo 1", deadline: datetime("2026-03-01T17:00:00.000Z").toDate(), categoryKeys: [1] },
        { name: "Todo 2", deadline: null, categoryKeys: [2] },
        { name: "Todo 3", deadline: datetime("2026-05-18T09:30:00.000Z").toDate(), categoryKeys: [3] },
        { name: "Todo 4", deadline: datetime("2026-04-12T14:15:00.000Z").toDate(), categoryKeys: [1, 2] },
        { name: "Todo 5", deadline: null, categoryKeys: [2, 3] },
        { name: "Todo 6", deadline: datetime("2026-06-02T22:00:00.000Z").toDate(), categoryKeys: [3, 1] },
        { name: "Todo 7", deadline: datetime("2026-02-25T07:45:00.000Z").toDate(), categoryKeys: [1, 4] },
        { name: "Todo 8", deadline: null, categoryKeys: [2, 5] },
        { name: "Todo 9", deadline: datetime("2026-07-09T12:20:00.000Z").toDate(), categoryKeys: [3, 6] },
        { name: "Todo 10", deadline: datetime("2026-08-01T16:00:00.000Z").toDate(), categoryKeys: [1, 2, 3] },
        { name: "Todo 11", deadline: null, categoryKeys: [1, 2, 3, 4] },
        { name: "Todo 12", deadline: datetime("2026-09-14T10:10:00.000Z").toDate(), categoryKeys: [2, 3, 5] },
        { name: "Todo 13", deadline: datetime("2026-10-28T18:40:00.000Z").toDate(), categoryKeys: [3, 6, 9] },
      ];

      const categoryMap: Record<string, CategoryEntity> = {};
      await Object.keys(categories).forEachAsync(async (key) => {
        categoryMap[key] = await categoryRepo.save(categoryRepo.create(categories[key]));
      });
      await todos.forEachAsync(async ({ categoryKeys, ...todoData }) => {
        await todoRepo.save(
          todoRepo.create({
            ...todoData,
            categories: categoryKeys.map((e) => categoryMap[e]),
          }),
        );
      });
    });
  }
}
