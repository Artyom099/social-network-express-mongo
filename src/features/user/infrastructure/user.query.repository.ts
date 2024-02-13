import {PagingViewModel, UserAccountDBModel} from '../../../infrastructure/types/types';
import {Filter} from 'mongodb';
import {userCollection} from '../../../infrastructure/db/db';


export const UserQueryRepository = {

  async getSortedUsers(searchEmailTerm: string | null, searchLoginTerm: string | null, pageNumber: number, pageSize: number,
                       sortBy: string, sortDirection: 'asc'|'desc'): Promise<PagingViewModel<UserAccountDBModel[]>> {

    const filter: Filter<UserAccountDBModel> = {
      $or: [
        { 'accountData.login': {$regex: searchLoginTerm ?? '', $options: "i"} },
        { 'accountData.email': {$regex: searchEmailTerm ?? '', $options: "i"} }
      ]
    }

    const totalCount: number = await userCollection.countDocuments(filter)

    const sortedUsers: UserAccountDBModel[] = await userCollection
      .find(filter, {projection: {_id: 0, id: 1, login: '$accountData.login', email: '$accountData.email', createdAt: '$accountData.createdAt'}})
      .sort({[sortBy]: sortDirection})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()

    return {
      pagesCount: Math.ceil(totalCount / pageSize),    // общее количество страниц
      page: pageNumber,                                   // текущая страница
      pageSize,                                           // количество пользователей на странице
      totalCount,                                         // общее количество пользователей
      items: sortedUsers  //todo здесь тип TUser!
    }
  },
}