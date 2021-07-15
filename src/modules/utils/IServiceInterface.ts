interface IServiceInterface {
  createRecord(...args: any): Promise<any>;
  updateRecord(...args: any): Promise<any>;
  deleteRecord(...args: any): Promise<any>;
  getRecord(...args: any): Promise<any>;
}

export default IServiceInterface;