const pool = require("../db");

const getAllUsers = async (req, res) => {
  try {
    const { rows: data } = await pool.query("SELECT * FROM users");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(404).send(`Something went wrong. ${err.message}`);
  }
};

const createUser = async (req, res) => {
  try {
    const { first_name, last_name, age, active } = req.body;
    console.log(req.body);
    const {
      rows: [newUser],
    } = await pool.query(
      "INSERT INTO users (first_name, last_name, age, active) VALUES ($1, $2, $3, $4) RETURNING *;",
      [first_name, last_name, age, active]
    );
    console.log(newUser);
    res.status(202).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(404).send(`Something went wrong. ${err.message}`);
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rows: [singleUser],
      rowCount,
    } = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    if (!rowCount)
      return res
        .status(404)
        .send(
          `The user with the id ${id} does not exist. Rowcount: ${rowCount}`
        );
    res.status(200).json(singleUser);
  } catch (err) {
    console.log(err);
    res.status(404).send(`Something went wrong. ${err.message}`);
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, active } = req.body;

  if (!first_name || !last_name || !age)
    return res.status(400).send("Please provide all values");
  try {
    const {
      rowCount,
      rows: [updatedUser],
    } = await pool.query(
      "UPDATE users SET first_name=$1,last_name=$2,age=$3, active=$4 WHERE id=$5 RETURNING *",
      [first_name, last_name, age, active, id]
    );

    if (!rowCount)
      return res
        .status(404)
        .send(
          `The user with id ${id} that you are trying to update does not exist`
        );

    res.status(201).send(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(404).send(`Something went wrong. ${err.message}`);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      rows: [deletedUser],
      rowCount,
    } = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [id]);

    // inform the user if they try to delete a user that does not exist
    if (!rowCount)
      return res
        .status(404)
        .send(
          `The user with id ${id} that you are trying to delete does not exist`
        );

    res
      .status(200)
      .send(`The user "${deletedUser.first_name}" has been deleted`);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

///get all orders for a single user
const getAllUserOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: allUserOrders, rowCount } = await pool.query(
      "SELECT * FROM users JOIN orders ON users.id=orders.user_id WHERE users.id =$1",
      [id]
    );
    if (!rowCount) return res.send("no orders yet");
    res.json(allUserOrders);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

//

const setUserInactive = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, active } = req.body;
  try {
    const { rows: allUserOrders, rowCount } = await pool.query(
      "SELECT * FROM users JOIN orders ON users.id=orders.user_id WHERE users.id =$1",
      [id]
    );
    if (!rowCount) {
      const inactiveUser = await pool.query(
        "UPDATE users SET active=$1 WHERE id=$2 RETURNING *",
        [false, id]
      );
      console.log("user is now inactive");
      return res.json(inactiveUser);
    }
    res.json(allUserOrders);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  getAllUserOrders,
  setUserInactive,
};
