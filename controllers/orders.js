const pool = require("../db");

const getAllOrders = async (req, res) => {
  try {
    const { rows: data } = await pool.query("SELECT * FROM orders");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(404).send(`Something went wrong. ${err.message}`);
  }
};

const createOrder = async (req, res) => {
  try {
    const { price, date, user_id } = req.body;
    console.log(req.body);
    const {
      rows: [neworder],
    } = await pool.query(
      "INSERT INTO orders (price, date, user_id ) VALUES ($1, $2, $3) RETURNING *;",
      [price, date, user_id]
    );
    console.log(neworder);
    res.status(202).json(neworder);
  } catch (err) {
    console.log(err);
    res.status(404).send(`Something went wrong. ${err.message}`);
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rows: [singleOrder],
      rowCount,
    } = await pool.query("SELECT * FROM orders WHERE id=$1", [id]);
    if (!rowCount)
      return res
        .status(404)
        .send(
          `The order with the id ${id} does not exist. Rowcount: ${rowCount}`
        );
    res.status(200).json(singleOrder);
  } catch (err) {
    console.log(err);
    res.status(404).send(`Something went wrong. ${err.message}`);
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { price, date, user_id } = req.body;

  if (!price || !date || !user_id)
    return res.status(400).send("Please provide all values");
  try {
    const {
      rowCount,
      rows: [updatedOrder],
    } = await pool.query(
      "UPDATE orders SET price=$1,date=$2,user_id=$3 WHERE id=$4 RETURNING *",
      [price, date, user_id, id]
    );

    if (!rowCount)
      return res
        .status(404)
        .send(
          `The order with id ${id} that you are trying to update does not exist`
        );

    res.status(201).send(updatedOrder);
  } catch (err) {
    console.log(err);
    res.status(404).send(`Something went wrong. ${err.message}`);
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      rows: [deletedOrder],
      rowCount,
    } = await pool.query("DELETE FROM orders WHERE id=$1 RETURNING *", [id]);

    // inform the order if they try to delete a order that does not exist
    if (!rowCount)
      return res
        .status(404)
        .send(
          `The order with id ${id} that you are trying to delete does not exist`
        );

    res.status(200).send(`The order "${deletedOrder.id}" has been deleted`);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
