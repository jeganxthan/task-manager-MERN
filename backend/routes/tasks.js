const express = require('express')
const router = express.Router()
const{getAllTask, 
    createTask,
    getTask,
    updateTask,
    deleteTask}=require('../controller/task')

router.route('/').get(getAllTask).post(createTask)
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask)

module.exports=router