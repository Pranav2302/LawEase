const asyncHandler = (resquestHandler)=>{
   return (req,res,next)=>{
        Promise.resolve(resquestHandler(req,res,next))
        .catch((err)=>next(err))
    }
}


export {asyncHandler}






//higher order functions- functions which are use as parameter or as variables  
// const asyncHandler =(fun) => async(req,res,next)=>{
//     try {
        
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }  