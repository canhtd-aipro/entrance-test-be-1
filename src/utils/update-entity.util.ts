import { isArray } from "lodash";

export function updateEntity<E, U>(entity: E, update: E | U): E | U {
  if (
    update !== null &&
    entity !== null &&
    typeof update === "object" &&
    typeof entity === "object" &&
    !(update instanceof Date) &&
    !(entity instanceof Date) &&
    !isArray(update) &&
    !isArray(entity)
  ) {
    for (const key in update) {
      // @ts-ignore
      entity[key] = updateEntity(entity[key], update[key]);
    }
    return entity;
  }
  return update === undefined ? entity : update;
}
