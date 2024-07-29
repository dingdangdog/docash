import api from './index'
import type { Page } from '@/types/page'
import type { Flow, FlowQuery, CreateFlowDto, UpdateFlowDto } from '@/types/model/flow'

/**
 * 查询全部流水
 * @returns FlowPage
 */
export function getAll(query: FlowQuery): Promise<Flow[]> {
  return api('getFlowList', localStorage.getItem('bookId'), query)
}

/**
 * 查询流水分页
 * @returns Page<Flow>
 */
export function getFlowPage(query: FlowQuery): Promise<Page<Flow>> {
  return api('queryFlowPage', localStorage.getItem('bookId'), query)
}

/**
 * 新增流水
 * @returns Page<Flow>
 */
export function createFlow(createDto: CreateFlowDto): Promise<Flow> {
  return api('createFlow', localStorage.getItem('bookId'), createDto)
}

/**
 * 修改流水
 * @returns Page<Flow>
 */
export function update(id: string, updateDto: UpdateFlowDto): Promise<Flow> {
  return api('updateFlow', localStorage.getItem('bookId'), { id, ...updateDto })
}

/**
 * 删除流水
 * @returns any
 */
export function deleteFlow(id: string): Promise<any> {
  return api('deleteFlow', localStorage.getItem('bookId'), id)
}

/**
 * 批量删除流水
 * @returns any
 */
export function deleteFlowsApi(ids: string[] | any): Promise<any> {
  return api('deleteFlows', localStorage.getItem('bookId'), ids)
}

/**
 * 批量导入流水
 * @param flows
 * @returns
 */
export function importFlows(importFlag: string, flows: Flow[]): Promise<any> {
  return api('importFlows', localStorage.getItem('bookId'), importFlag, flows)
}
