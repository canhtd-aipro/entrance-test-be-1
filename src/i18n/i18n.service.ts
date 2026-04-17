import { Injectable } from "@nestjs/common";
import i18next from "i18next";
import FsBackend from "i18next-fs-backend";
import { ClsService } from "nestjs-cls";
import { join } from "path";
import { Language } from "../enums/language.enum";
import { AppClsStore } from "../types/cls-store.type";

@Injectable()
export class I18nService {
  constructor(private clsService: ClsService<AppClsStore>) {}

  async getTranslation() {
    let lng = this.clsService.get("locale") ?? Language.Ja;
    if (!(lng in Language)) lng = Language.Ja;

    return i18next.use(FsBackend).init({
      fallbackLng: Language.Ja,
      lng,
      backend: {
        loadPath: join(__dirname, "./locales/{{lng}}.json"),
      },
      interpolation: {
        escapeValue: false, // react already safes from xss
        alwaysFormat: true,
        format: (value) => {
          if (value === undefined || value === null) {
            return "";
          }
          return value;
        },
      },
    });
  }
}
