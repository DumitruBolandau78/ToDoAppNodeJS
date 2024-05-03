const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

const router = Router();

router.get('/signup', authMiddleware, (req, res) => {
    if(req.session.isAuthenticated){
        return res.redirect('/');
    }

    res.render('auth', {
        title: 'Sign Up',
        isSignup: true
    });
});

router.get('/login', authMiddleware, (req, res) => {
    if(req.session.isAuthenticated){
        return res.redirect('/');
    }

    res.render('auth', {
        title: 'Log In',
        isLogin: true
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect('/auth/login');
    });
});

router.post('/signup', async (req, res) => {
    try {
        const { emailSignup, passwordSignup } = req.body;
        const candidate = await User.findOne({email: emailSignup});

        if(candidate){
            return res.redirect('/auth/signup');
        }

        const hashPassword = await bcrypt.hash(passwordSignup, 10);
        const user = new User({ email: emailSignup, password: hashPassword, goals: [] });
        await user.save();

        res.redirect('/auth/login');
    } catch (error) {
        console.log(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const {emailLogin, passwordLogin} = req.body;
        const candidate = await User.findOne({email: emailLogin});

        if(!candidate){
            return res.redirect('/auth/login');
        }

        const areSame = await bcrypt.compare(passwordLogin, candidate.password);
            
        if(!areSame){
            return res.redirect('/auth/login');
        }

        req.session.isAuth = true;
        req.session.user = candidate;
        req.session.save((err) => {
            if(err) throw new err;
            res.redirect('/');
        });

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;