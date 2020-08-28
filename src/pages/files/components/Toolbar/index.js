import React, { useState, useEffect } from "react";
import { Icon, Button, Select, message } from "antd";
import printJS from "print-js";
import { Main } from "./styled";
import { fontFamilies, fontSizes } from "components/EditorTool/Text/constants";
import { generate } from "./constant";
import * as command from "components/EditorTool/utils";
import PdfView from "../PdfView";
import pdfUtils from "utils/pdf-utils";
const Toolbar = ({
  saveStatus,
  saveData,
  fileOnShow,
  changeFile,
  handleOpen,
  fileData,
  patientDocument,
  list,
}) => {
  const [fontSize, setFontSize] = useState("2");
  const [idx, setIdx] = useState(0);
  const [fontFamily, setFontFamily] = useState("timeNewRomance");
  const [printLoading, setPrintLoading] = useState(false);
  const [filePDF, setFile] = useState("");
  const [isShowPDF, setShowPDF] = useState(false);
  const handleChangeFontSize = (value) => {
    setFontSize(value);
    command.setFontSize(value);
  };

  useEffect(() => {
    // console.log('file on show: ', fileOnShow);
  }, [fileOnShow]);

  const next = () => {
    if (idx < list.length - 1) {
      setIdx(idx + 1);
      loadForm(idx + 1);
    }
  };

  const back = () => {
    if (idx > 0) {
      loadForm(idx - 1);
      setIdx(idx - 1);
    }
  };

  const loadForm = (index) => {
    changeFile(list[index]);
  };

  const showPDF = (type) => {
    setShowPDF(type);
  };

  const genPdf = () => {
    pdfGenerator().then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      setFile(blobUrl);
    });
    showPDF(true);
  };

  const pdfGenerator = () => {
    return new Promise((resolve, reject) => {
      try {
        const wrapElm = document.createElement("div");
        wrapElm.setAttribute("class", "print-wrapper");
        wrapElm.setAttribute("id", "print-wrapper");

        const printArea = document.createElement("div");
        printArea.setAttribute("id", "print-area");
        printArea.setAttribute("class", "view-file-mode");
        printArea.style.fontFamily = `font-family: "Times New Roman", sans-serif;`;
        printArea.style.color = "black";

        wrapElm.append(printArea);

        let lines = [];

        const file = Array.from(
          document.getElementsByClassName("form-content")
        )[0];

        if (file) {
          Array.from(file.childNodes).forEach((itemLv1) => {
            lines = [...lines, ...Array.from(itemLv1.childNodes)];
          });

          generate(lines, printArea);
        }

        if (wrapElm) {
          let html = document.getElementsByTagName("html")[0].cloneNode(true);
          let body = Array.from(html.childNodes).find(
            (item) => item.nodeName === "BODY"
          );
          if (body) {
            body.innerHTML = wrapElm.outerHTML;
          }
          // var myWindow = window.open("", "MsgWindow");
          // myWindow.document.write(html.outerHTML);
          pdfUtils
            .htmlToPdf(html.outerHTML, {
              format: "A4",
              margin: {
                // top: "0px",
              },
            })
            .then((blob) => {
              resolve(blob);
            })
            .catch((e) => {
              message.error(e?.message || "Xảy ra lỗi, vui lòng thử lại sau");
              reject(e);
            });
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const print2 = () => {
    setPrintLoading(true);
    pdfGenerator()
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        setPrintLoading(false);
        printJS({
          printable: blobUrl,
          type: "pdf",
        });
      })
      .catch((e) => {
        setPrintLoading(false);
      });
  };

  return (
    <Main>
      <div className="toolbar">
        <div className={"toolbar-left"}>
          <div className={"editor-tool"}>
            <Select
              style={{ width: 150 }}
              placeholder={"font-family"}
              size={"small"}
              value={fontFamily}
              onChange={setFontFamily}
            >
              {Object.keys(fontFamilies).map((key) => (
                <Select.Option key={key} value={key}>
                  {fontFamilies[key]}
                </Select.Option>
              ))}
            </Select>

            <Select
              size={"small"}
              style={{ width: 70 }}
              placeholder={"font-size"}
              className={"item-tool"}
              value={fontSize}
              onChange={handleChangeFontSize}
            >
              {Object.keys(fontSizes).map((item) => (
                <Select.Option key={item} value={item}>
                  {fontSizes[item]}
                  {" pt"}
                </Select.Option>
              ))}
            </Select>

            <Button
              icon={"bold"}
              size={"small"}
              onClick={command.bold}
              className={"item-tool"}
            />
            <Button
              icon={"italic"}
              size={"small"}
              onClick={command.italic}
              className={"item-tool"}
            />
            <Button
              icon={"underline"}
              size={"small"}
              onClick={command.underline}
              className={"item-tool"}
            />
            <Button
              loading={printLoading}
              icon={"printer"}
              size={"small"}
              onClick={print2}
              className={"item-tool"}
            />
          </div>

          <div className={"file-system-tool"}>
            <Button
              icon={"save"}
              loading={saveStatus}
              onClick={saveData}
              type={"primary"}
              className={"item-tool text-btn"}
            >
              {"Lưu"}
            </Button>
          </div>

          <div className={"file-system-tool"}>
            {process.env.REACT_APP_HIDE_SIGNER === "false" && (
              <Button
                icon={"file-done"}
                type={"default"}
                className={"item-tool text-btn"}
                onClick={genPdf}
              >
                {"Kí file"}
              </Button>
            )}
          </div>
        </div>

        <div className="toolbar-right">
          <div className={"file-selection"}>
            <button className={"arrow-btn"} onClick={back}>
              <Icon type="left" />
            </button>

            <div className={"file-name-d"} onClick={handleOpen}>
              <span className={"file-name-text"}>
                {fileOnShow.formName || fileOnShow.ten}
              </span>
            </div>

            <button className={"arrow-btn"} onClick={next}>
              <Icon type="right" />
            </button>
          </div>
        </div>
      </div>

      <PdfView
        visible={isShowPDF}
        showModal={showPDF}
        urlFile={filePDF}
        fileOnShow={fileOnShow}
        fileData={fileData}
        patientDocument={patientDocument}
      />
    </Main>
  );
};

export default Toolbar;
