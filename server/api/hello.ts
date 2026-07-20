const database = ["apple", "banana", "cherry", "date", "elderberry"];

export default defineEventHandler( async(event) =>{

//     await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate a delay
//    throw  createError({
//         statusCode: 500,
//         statusMessage: "Internal Server Error",
//         message: "An unexpected error occurred while processing your request."
//     });
    return{
        hello:"world",
        database: database
    }
})