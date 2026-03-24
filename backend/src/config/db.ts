import AppDataSource from "./data-source";

const testDBConnection = async () => {
 try{
  await AppDataSource.initialize();
  console.log("Database connection established successfully.");
 }
  catch(error: any){
    console.error("Error connecting to the database:", error);
  }
};

export default testDBConnection;