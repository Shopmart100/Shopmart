class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }  
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryStrCopy = { ...this.queryStr };
    // Removeing Some Fields For Categories
    const removeFields = ["keyword", "pagination", "limit"];
    removeFields.forEach((key) => delete queryStrCopy[key]);
    //filter for price
    let queryStr = JSON.stringify(queryStrCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));
    if(this.queryStr.colors){
      this.query = this.query.find({
        colors: {
            $elemMatch :{
              colorname: this.queryStr.colors
            }
        }
      });
    }
    if(this.queryStr.sizes){
      this.query = this.query.find({
        sizes: {
            $elemMatch :{
              sizename: this.queryStr.sizes
            }
        }
      });
    }
    return this;
    []
  }
   //For Pagination
   pagination(resultperpage){
    const cuurentpage = Number(this.queryStr.page) || 1;
    const skip = resultperpage * (cuurentpage - 1);
    this.query = this.query.limit(resultperpage).skip(skip);
    return this;
   }
}
module.exports = ApiFeatures;
