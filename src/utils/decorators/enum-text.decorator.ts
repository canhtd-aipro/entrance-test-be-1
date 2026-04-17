type EnumTextMeta = {
  enumType: any;
  key: string;
};

export const EnumText = (enumType: any, key: string) => (target: any, propertyKey: string | symbol) => {
  const meta: EnumTextMeta = { enumType, key };
  Reflect.defineMetadata("enum:text", meta, target, propertyKey);
};
