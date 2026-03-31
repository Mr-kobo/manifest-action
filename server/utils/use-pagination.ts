import _ from "lodash";
import { Query, SortOrder } from "mongoose";
import { Paginated } from "~~/models/core/common.model";

export default async <T = any>(query: Query<any, any>, page: { index: number, limit: number, skip?: number }): Promise<Paginated<T>> => {
  let index = page.index; // vuestick start index at 1 :/ idk how to desable it  
  let skip = 0;
  const limit = page.limit;
  query.setQuery(_.omit(query.getQuery(), 'index', 'pages', 'total', 'limit', 'skip'));

  let data = [];
  let total = 0;
  let pages = 0;
  if (limit >= 0) { // only run count if limit == 0 
    total = await query.clone().countDocuments().exec();
    pages = limit? Math.ceil(total / limit): 0;
  }
  if (limit > 0) { // normaly run pagination 
    skip = !_.isNaN(page.skip) && !_.isNil(page.skip) ? page.skip : (index - 1 >= 0 ? index - 1 : 0) * limit;
    
    if (skip > total) {
      skip = 0;
      index = 1;
    }

    if (!_.isNaN(page.skip) && !_.isNil(page.skip)) {
      index = Math.floor(skip / limit) + 1;
    }
    data = await query.skip(skip).limit(limit).exec();
  }
  if (limit < 0) { // disable pagination if limit = -1
    data = await query.exec();
  }

  // console.log(data)
  return new Paginated<T>({
    page: {
      index: page.index,
      limit: page.limit,
      pages,
      total,
      skip: !_.isNaN(page.skip) && !_.isNil(page.skip)? page.skip : undefined
    },
    data,
  });
};