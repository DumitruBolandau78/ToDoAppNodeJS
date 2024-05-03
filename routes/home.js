const { Router } = require('express');
const authMiddleware = require('../middleware/auth');
const UserSchema = require('../models/user');

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
    const user = await UserSchema.findOne({ _id: req.session.user._id});
    const goals = user.goals;
    res.render('home', {
        title: 'To Do App. Make your goals.',
        isAuth: req.session.isAuth,
        userId: req.session.user._id,
        userItems: goals
    });
});

router.post('/', authMiddleware,  async (req, res) => {
    try {
        const { goal, userId } = req.body;

        const user = await UserSchema.findOne({ _id: req.session.user._id });
        const goals = user.goals;
        goals.push({
            goal: goal,
            date: Date.now()
        });

        await UserSchema.findOneAndUpdate( { _id: userId }, { goals });
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

router.post('/goal-delete/:id', async (req, res) => {
    const goalId = req.params.id;

    try {
        const user = await UserSchema.findOne({_id: req.session.user._id});

        const goals = user.goals;      
        const filteredGoals = goals.filter(goal => goal._id.toString() !== goalId);
        console.log(filteredGoals);

        user.goals = filteredGoals;

        await user.save();
        res.redirect('/');
        
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;