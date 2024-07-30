const serverApi = require("./api.js");

class Flow {
  constructor(
    id,
    bookId,
    day,
    flowType,
    type,
    money,
    payType,
    name,
    description
  ) {
    this.id = id;
    this.bookId = bookId;
    this.day = day;
    // 流水类型：支出、收入
    this.flowType = flowType;
    // 消费类型、收入类型
    this.type = type;
    // 支付方式、收款方式
    this.payType = payType;
    this.money = money;
    this.name = name;
    this.description = description;
  }
}

const getFileName = (bookId) => {
  return `flow${bookId}.csv`;
};

// 读取全部流水数据
const readFlows = (bookId) => {
  return serverApi.readData(getFileName(bookId));
};

// 增加数据
const addFlow = async (bookId, flow) => {
  const arr = [];
  const FLOW = new Flow(
    serverApi.getUUID(),
    bookId,
    flow.day,
    flow.flowType,
    flow.type,
    flow.money,
    flow.payType,
    flow.name,
    flow.description
  );
  arr.push(FLOW);
  await serverApi.addDatas(getFileName(bookId), arr);
  return serverApi.toResult(200, FLOW);
};

// 批量增加数据
const addFlows = (bookId, flows) => {
  return serverApi.addDatas(getFileName(bookId), flows);
};

// 删除全部数据
const deleteAllFlow = (bookId) => {
  return serverApi.deleteAll(getFileName(bookId));
};

// 批量删除数据
const deleteFlows = async (bookId, ids) => {
  await serverApi.deleteDatas(getFileName(bookId), ids);
  return serverApi.toResult(200, ids.length);
};

// 修改数据
const updateFlow = async (bookId, data) => {
  await serverApi.updateData(getFileName(bookId), data);
  return serverApi.toResult(200, data);
};

const updateFlows = async (bookId, flows) => {
  await serverApi.updateDatas(getFileName(bookId), flows);
  return serverApi.toResult(200, flows.length);
};

const getFlowList = async (bookId, query) => {
  const flows = await queryFlows(bookId, query);
  return serverApi.toResult(200, flows);
};

// 基于查询条件的查询
const queryFlows = async (bookId, query) => {
  const data = await readFlows(bookId);
  let result = data;

  if (query.id) {
    result = result.filter((item) => item.id == query.id);
  }
  if (query.startDay) {
    result = result.filter(
      (item) => new Date(item.day) >= new Date(query.startDay)
    );
  }
  if (query.endDay) {
    result = result.filter(
      (item) => new Date(item.day) <= new Date(query.endDay)
    );
  }
  if (query.flowType) {
    result = result.filter((item) => item.flowType === query.flowType);
  }
  if (query.type) {
    result = result.filter((item) => item.type === query.type);
  }
  if (query.payType) {
    result = result.filter((item) => item.payType === query.payType);
  }
  if (query.name) {
    result = result.filter((item) => item.name.includes(query.name));
  }
  if (query.description) {
    result = result.filter((item) =>
      item.description.includes(query.description)
    );
  }
  return result;
};

const queryFlowPage = async (bookId, query) => {
  let result = await queryFlows(bookId, query);
  // 排序
  if (query.moneySort) {
    result = result.sort((a, b) =>
      query.moneySort === "ASC" ? a.money - b.money : b.money - a.money
    );
  }

  // 分页
  const start = (query.pageNum - 1) * query.pageSize;
  const end = start + query.pageSize;

  totalIn = 0;
  totalOut = 0;
  notInOut = 0;
  result.forEach((item) => {
    if (item.flowType == "支出") {
      totalOut += Number(item.money);
    } else if (item.flowType == "收入") {
      totalIn += Number(item.money);
    } else {
      notInOut += Number(item.money);
    }
  });

  pageNum = query.pageNum;
  pageSize = query.pageSize;
  pageData = result.slice(start, end);
  totalCount = result.length;

  return serverApi.toResult(200, {
    pageNum,
    pageSize,
    pageData,
    totalCount,
    totalIn,
    totalOut,
    notInOut,
  });
};

const importFlows = async (bookId, flag, flows) => {
  if (flag == "overwrite") {
    deleteAllFlow(bookId);
  }
  const FLOWS = [];
  for (let flow of flows) {
    // id, bookId, day, flowType, type, money, payType, name, description
    FLOWS.push(
      new Flow(
        serverApi.getUUID(),
        bookId,
        flow.day,
        flow.flowType,
        flow.type,
        flow.money,
        flow.payType,
        flow.name,
        flow.description
      )
    );
  }
  await addFlows(bookId, FLOWS);
  return serverApi.toResult(200, FLOWS.length);
};

module.exports = {
  readFlows,
  queryFlows,
  importFlows,
  addFlow,
  deleteFlows,
  updateFlow,
  updateFlows,
  queryFlowPage,
  getFlowList,
};

// console.log(queryFlows(101, {pageNum:1, pageSize: 10}))
