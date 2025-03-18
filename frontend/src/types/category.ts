export interface ICategory {
  _id:string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategories {
  categories: ICategory[];
}
