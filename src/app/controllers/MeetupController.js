import * as Yup from 'yup';
import { startOfHour, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      user_id: req.userId,
      attributes: ['title', 'description', 'date', 'banner', 'localization'],
    });

    if (!meetups.length) {
      return res.json({
        status: false,
        message: 'Você ainda não cadastrou nenhum MeetUp!',
      });
    }

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      date: Yup.date().required(),
      user_id: Yup.number().required(),
      localization: Yup.string().required(),
      banner: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        status: false,
        error: 'Valores de campos inválidos ou não preenchidos.',
      });
    }

    // TODO: Check date meetup is passed
    const formattedDate = startOfHour(parseISO(req.body.date));
    const data = { ...req.body, date: formattedDate };

    const { id, title, description, date, localization } = await Meetup.create(
      data
    );

    return res.json({
      id,
      title,
      description,
      date,
      localization,
    });
  }
}

export default new MeetupController();
