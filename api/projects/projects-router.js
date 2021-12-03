// Write your "projects" router here!

const Projects = require("./projects-model")
const express = require("express")
const router = express.Router()
const {validateProjectId, validateProject} = require("./projects-middleware")


router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                message: 'Error retrieving projects list'
            })
        })
})

router.get('/:id', (req, res) => {
    const { id } = req.params
    Projects.get(id)
        .then(project => {
            if (!project) {
                res.status(404).json({
                    message: 'The project with the specified id does not exist'
                })
            }
            else {
                res.status(200).json(project)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: 'Error retrieving project'
            })
        })
})

router.post('/', (req, res) => {
    const newProject = req.body
    if (!newProject.name || !newProject.description) {
        res.status(400).json({
            message: 'Please provide a name and description'
        })
    }
    else {
        Projects.insert(newProject)
            .then(() => {
                res.status(201).json(newProject)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    message: 'Error adding project'
                })
            })
    }
})

router.put("/:id", validateProjectId, validateProject, (req, res, next) => {
    if(req.body.completed === undefined){
        next({
            status: 400,
            message: 'Project ID does not exist'})
    } else{
        Projects.update(req.params.id, req.body)
            .then(() => {
                return Projects.get(req.params.id)
            })
            .then(project => {
                res.json(project)
            })
            .catch(next)
    }
})

router.delete("/:id", validateProjectId, async (req, res, next) => {
    try{
        await Projects.remove(req.params.id)
        res.json(res.Projects)
    } catch(err){
        next(err)
    }
})

router.get("/:id/actions", validateProjectId, async (req, res, next) => {
    Projects.getProjectActions(req.params.id)
        .then(actions => {
            if(actions.length > 0){
                res.status(200).json(actions)
            } else {
                res.status(404).json((actions))
            }
        })
        .catch(next)
})

module.exports = router 

