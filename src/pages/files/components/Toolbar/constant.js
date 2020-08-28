const PAGE_HEIGHT = 1123;

const createPage = () => {
  const pageTemplate = document.createElement("div");
  pageTemplate.setAttribute("class", "form-content page-inside");

  return pageTemplate;
};

const appendTr = (trs = [], itemTemplate, line, height, page, printArea) => {
  let newLine = null;
  let tbody = null;
  trs.forEach((tr, index) => {
    if (height + tr.offsetHeight > PAGE_HEIGHT) {
      console.log(index);
      page = createPage();
      printArea.append(page);
      newLine = null;
      height = 0;
      tbody = null;
    }
    if (!newLine) {
      newLine = line.cloneNode();
      page.append(newLine);
    }
    if (!tbody) {
      let table = itemTemplate.cloneNode(true);
      newLine.append(table);
      tbody = table.getElementsByTagName("tbody")[0];
    }
    if (newLine && tbody) {
      height += tr.offsetHeight;
      tbody.append(tr.cloneNode(true));
    }
  });
  return { nPage: page, nHeight: height };
};

const appendTable = (table, line, item, height, page, printArea) => {
  let itemTemplate = item.cloneNode(true);
  let tbody = itemTemplate.getElementsByTagName("tbody");
  if (tbody?.length) {
    tbody[0].innerHTML = "";
  }
  let trs = Array.from(table.getElementsByTagName("tr"));
  return appendTr(trs, itemTemplate, line, height, page, printArea);
};

const appendLine = (line, height, page, printArea) => {
  if (!page) {
    page = createPage();
    printArea.append(page);
  }
  if (height + line.offsetHeight <= PAGE_HEIGHT) {
    //cộng line vào page hiện taị nếu chưa vượt quá
    page.append(line.cloneNode(true));
    height += line.offsetHeight;
    return {
      nHeight: height,
      nPage: page,
    };
  } //trường hợp vượt quá
  else {
    let newLine; //clone ra 1 line rỗng
    let childNodes = Array.from(line.childNodes); //get all child Node
    childNodes.forEach((item) => {
      if (height + item.offsetHeight > PAGE_HEIGHT) {
        let table = item.getElementsByTagName("tbody")[0];
        if (table) {
          let { nPage, nHeight } = appendTable(
            table,
            line,
            item,
            height,
            page,
            printArea
          );
          page = nPage;
          height = nHeight;
          return;
        } else 
        {
          //neu item height vượt quá
          page = createPage(); //tao moi 1 page moi
          printArea.append(page); //thêm vào area
          newLine = null; //tao moi 1 line moi
          height = 0; //reset height
        }
      }
      if (!newLine) {
        newLine = line.cloneNode();
        page.append(newLine);
      }
      newLine.append(item.cloneNode(true)); //thêm item vào line
      height += item.offsetHeight; //update current height;
      if (height > PAGE_HEIGHT) height = height - PAGE_HEIGHT;
    });
    return {
      nHeight: height,
      nPage: page,
    };
  }
};

const generate = (lines, printArea, height = 0) => {
  let index = 0;
  let page = null;
  do {
    if (lines[index]) {
      const { nHeight, nPage } = appendLine(
        lines[index],
        height,
        page,
        printArea
      );
      page = nPage;
      height = nHeight;
      index += 1;
    }
  } while (lines[index]);
};

export { PAGE_HEIGHT, generate };
