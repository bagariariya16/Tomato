import foodModel from "../models/foodModel.js";
import fs from 'fs'

//add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`

    //create new food using food model
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    })

    try {
        await food.save();
        res.json({
            success: true,
            message: "Food Added"
        })
    }
    catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Error"
        })
    }
}

//List of all food
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Remove food item
const removeFood = async (req, res) => {
    try {

        //find the food model by id
        const food = await foodModel.findById(req.body.id);

        //to delete image from uploads folder
        fs.unlink(`uploads/${food.image}`, () => { })

        //delete image from dB
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({
            success: true,
            message: "Food Removed"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error"
        })
    }
}
export { addFood, listFood, removeFood }