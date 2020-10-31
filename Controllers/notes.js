//init
const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const users = require("../Model/users");
const notes = require("../Model/notes");

//Middleware
router.use(bodyParser.urlencoded({ extended: true }));

/*
==========
Read
==========
*/

router.get("/notes", async (req, res) => {
	//finding note data to show on front page
	const userNotes = await users
		.findOne({ _id : req.user.id })
		.populate("notes");

	//User Response
	res.status(200).render("notes", {
		data: userNotes.notes.reverse(),
		error: req.flash("create_error"),
	});
});

/*
==========
Create
==========
*/

router.post(
	"/notes",
	//Validate User Entry
	[check("title").trim(), check("note").not().isEmpty().trim()],
	(req, res) => {
		const validationError = validationResult(req);
		if (!validationError.isEmpty()) {
			//if validation failed
			req.flash("create_error", "Not Cannot be empty");
			res.redirect("/notes");
		} else {
			//if validation ok
			//finding user data link note with this user
			users.findOne({ _id: req.user.id }, (err, user) => {
				if (err) throw err;
				//Creating note
				notes.create(
					{
						title:
							req.body.title === "" ? "Untitled" : req.body.title,
						note: req.body.note,
						user: user._id,
					},
					(err, result) => {
						if (err) throw err;
						//Linking user to notes
						users.findOneAndUpdate(
							{ _id: user._id },
							{
								$push: {
									notes: result._id,
								},
							},
							(err) => {
								if (err) throw err;
								//if everything successful
								res.redirect("/notes");
							}
						);
					}
				);
			});
		}
	}
);


/*
=================
Update Note
=================
*/

//Show Update Page
router.get("/update/:id", async (req, res) => {
	//Finding notes to show other notes on update page
	const userNotes = await users.findOne({ _id: req.user.id }).populate("notes");

	//User Response
	notes.findOne({ _id: req.params.id }, (readErr, ReadResult) => {
		if (readErr || ReadResult == null) {
			//if error Occurred
			res.status(200).redirect("/");
		} else {
			//if note found
			res.status(200).render("update", { data: userNotes.notes.reverse(), error: req.flash("create_error"), value: ReadResult, });
		}
	});
});

//Update
router.put(
	"/update/:id",
	[
		//Validate the note that has to update
		check("title").trim(),
		check("note").not().isEmpty().trim(),
	],
	(req, res) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			//if validation error
			req.body._id = req.params.id;
			req.flash('create_error', 'Note cannot be empty');
			res.status(200).redirect(`/update/${req.body._id}`);
		} else {
			//if validation Ok
			notes.findOneAndUpdate(
				{ _id: req.params.id },
				{
					title: req.body.title === ''? 'Untitled' : req.body.title,
					note: req.body.note,
				},
				(updateErr, updateResult) => {
					if (updateErr || updateResult == null) {
						//if Error on updating
						req.flash('create_error', 'Failed to update your note');
						res.redirect(`/update/${req.params.id}`);
					} else {
						//if Update successfully
						res.redirect("/notes");
					}
				}
			);
		}
	}
);


/*
========================
Mark note as important
========================
*/

/*
We saved the important value as default in boolean with every note that created, and we write the logic in front-end /views/partials/notes.
ejs file, if important value is false then note card's title style will be normal and if important value is true then card's title style 
will be Red, and it toggles when user click on important.
*/

router.put("/mark/:id", (req, res) => {
	//finding note that has to update with important value
	notes.findOne({ _id: req.params.id }, (err, result) => {
		if (!err && result != null) {
			//if we found that note
			if (result.important === false) {
				//if important value is false then we have set it to true
				notes.findOneAndUpdate(
					{ _id: result._id },
					{ important: true },
					(updateError) => {
						if (updateError) throw updateError;
						//if updates successfully
						res.redirect("/");
					}
				);
			} else if (result.important === true) {
				//if important value is true then we have set it to false
				notes.findOneAndUpdate(
					{ _id: result._id },
					{ important: false },
					(updateError) => {
						if (updateError) throw updateError;
						//if updates successfully
						res.redirect("/");
					}
				);
			} else {
				//if we cannot update the value
				res.redirect("/");
			}
		} else {
			//if that note not found in our db
			res.redirect("/notes");
		}
	});
});

/*
===========
Delete
===========
*/

router.delete("/delete/:id", (req, res) => {
	//finding the note that has to delete
	notes.findOneAndDelete({ _id: req.params.id }, (err, result) => {
		if (err || result == null) {
			//if error
			res.status(200).redirect("/");
		} else {
			//if deleted successfully
			res.status(200).redirect("/");
		}
	});
});

//Module Export for handling HTTP requests in index.js
module.exports = router;
