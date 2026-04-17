import { Priority } from "../../../enums/priority.enum";
import { ListQuery } from "../../../utils/dto/list-query.dto";

export class ListTodosQuery extends ListQuery {
  deadlineFrom?: Date;

  deadlineTo?: Date;

  categoryIds?: number[]; // filter todos that include at least one of these categories

  priorities?: Priority[]; // filter todos that ONLY include categories of these priority
}
