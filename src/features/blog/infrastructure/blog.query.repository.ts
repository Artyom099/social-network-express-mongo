import {BlogViewModel, PagingViewModel} from '../../../infrastructure/types/types';
import {BlogModel} from './blogs-schema';

export class BlogQueryRepository {

  async getSortedBlogs(searchNameTerm: string | null, pageNumber: number, pageSize: number, sortBy: string,
                       sortDirection: 'asc'|'desc'): Promise<PagingViewModel<BlogViewModel[]>> {

    const filter = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {}

    const totalCount: number = await BlogModel.countDocuments(filter)

    const sortedBlogs: BlogViewModel[] = await BlogModel.find(filter,{ _id: 0, __v: 0 })
      .sort({[sortBy]: sortDirection})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)

    return {
      pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
      page: pageNumber,                                   // текущая страница
      pageSize,                                           // количество блогов на странице
      totalCount,                                         // общее количество блогов
      items: sortedBlogs
    }
  }
}