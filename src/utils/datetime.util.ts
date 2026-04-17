import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

export const datetime = dayjs;
datetime.extend(isBetween);
datetime.extend(isSameOrAfter);
datetime.extend(isSameOrBefore);
