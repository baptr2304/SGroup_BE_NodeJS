const knex = require('../db/knex');

const addOption = async (req, res) => {
  const { pollId, optionText } = req.body;

  try {
    // Thực hiện thêm option vào cơ sở dữ liệu
    await knex('options').insert({
      poll_id: pollId,
      option_text: optionText,
    });

    return res.status(201).json({
      message: 'Option added successfully',
    });
  } catch (error) {
    console.error('Failed to add option:', error);
    return res.status(500).json({
      error: 'Failed to add option',
    });
  }
};
// update option
const updateOption = async (req, res) => {
  const { optionId, optionText } = req.body;

  try {
    // check option have in database
    const option = await knex('options')
      .where('id', optionId)
      .first();
    if (!option) {
      return res.status(404).json({
        error: 'Option not found',
      });
    }

    // update option
    await knex('options')
      .where('id', optionId)
      .update({
        option_text: optionText,
      });

    return res.status(200).json({
      message: 'Option updated successfully',
    });
  } catch (error) {
    console.error('Failed to update option:', error);
    return res.status(500).json({
      error: 'Failed to update option',
    });
  }
};


module.exports = {
  addOption,
  updateOption
};
