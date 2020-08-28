import { PDF_HOST } from "client/request";
import { GENERATE_PDF } from "client/api";

export default {
  htmlToPdf(html, options = {}) {
    return new Promise((resolve, reject) => {
      fetch(`${PDF_HOST}${GENERATE_PDF}`, {
        method: "POST",
        body: JSON.stringify({
          html: html,
          options: options,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((s) => s.blob())
        .then((blob) => {
          resolve(blob);
        })
        .catch((e) => {
          reject(e);
        //   message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
        //   setPrintLoading(false);
        });
    });
  },
};
