const knex = require('../db/knex');
const createPollWithOptions = async (req, res) => {
    const { question, options } = req.body;
    const createdBy = req.session.id;
    let trx;
  
    try {
      // Bắt đầu transaction
      trx = await knex.transaction();
  
      // Tạo bài khảo sát
      const poll = await knex('polls')
        .transacting(trx)
        .insert({ question, created_by: createdBy });
  
      const pollId = poll[0];
  
      // Tạo các tùy chọn
      const optionsPromises = options.map((option) => {
        return knex('options').transacting(trx).insert({
          poll_id: pollId,
          option_text: option,
        });
      });
  
      await Promise.all(optionsPromises);
  
      // Commit transaction nếu mọi thứ thành công
      await trx.commit();
  
      return res.status(201).json({
        message: 'Poll and options created successfully',
        pollId,
      });
    } catch (err) {
      // Rollback transaction nếu có lỗi xảy ra
      if (trx) {
        await trx.rollback();
      }
      console.error(err); // Ghi lại thông báo lỗi trong console
      return res.status(500).json({
        error: 'Failed to create poll and options',
      });
    }
  };
  // get all poll
  const getAllPolls = async (req, res) => {
    try {
      const polls = await knex('polls').select('*');

      return res.status(200).json({
        polls,
      });
    } catch (error) {
      console.error('Failed to get polls:', error);
      return res.status(500).json({
        error: 'Failed to get polls',
      });
    }
  };

  // // get poll by id
  // const getPollById = async (req, res) => {
  //   const { id } = req.params;
  
  //   try {
  //     const poll = await knex('polls')
  //       .where('id', id)
  //       .first();
  
  //     if (!poll) {
  //       return res.status(404).json({
  //         error: 'Poll not found',
  //       });
  //     }
  
  //     return res.status(200).json({
  //       poll,
  //     });
  //   } catch (error) {
  //     console.error('Failed to get poll:', error);
  //     return res.status(500).json({
  //       error: 'Failed to get poll',
  //     });
  //   }
  // };
  

module.exports = {
  createPollWithOptions,
  getAllPolls,
};
