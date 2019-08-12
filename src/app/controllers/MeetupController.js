import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async index(req, res) {
    // Meetups from user logged
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
      banner: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        status: false,
        error: 'Valores de campos inválidos ou não preenchidos.',
      });
    }

    const dateForm = parseISO(req.body.date);

    // Check date meetup is passed
    if (isBefore(dateForm, new Date())) {
      return res.status(400).json({
        status: false,
        error: 'Nâo é possível cadastrar um MeetUp pra uma data anterior.',
      });
    }

    const { id, title, description, date, localization } = await Meetup.create(
      req.body
    );

    return res.json({
      id,
      title,
      description,
      date,
      localization,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      date: Yup.date().required(),
      user_id: Yup.number().required(),
      localization: Yup.string().required(),
      banner: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        status: false,
        error: 'Valores de campos inválidos ou não preenchidos.',
      });
    }

    const meetup = await Meetup.findByPk(req.params.id);

    // Meetup doesn't exists
    if (!meetup) {
      return res.status(401).json({
        status: false,
        error: 'Esse MeetUp não existe.',
      });
    }

    // User logged not is owner from meetup
    if (meetup.user_id !== req.userId) {
      return res.status(401).json({
        status: false,
        error:
          'Nâo é possível editar um MeetUp no qual você não é um organizador.',
      });
    }

    // Meetup is passed
    if (isBefore(meetup.date, new Date())) {
      return res.status(401).json({
        status: false,
        error: 'Nâo é possível editar um MeetUp que já foi realizado.',
      });
    }

    const { id, title, description, date, localization } = await meetup.update(
      req.body
    );

    return res.json({
      id,
      title,
      description,
      date,
      localization,
    });
  }

  async destroy(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    // Meetup doesn't exists
    if (!meetup) {
      return res.status(401).json({
        status: false,
        error: 'Esse MeetUp não existe.',
      });
    }

    // User logged not is owner from meetup
    if (meetup.user_id !== req.userId) {
      return res.status(401).json({
        status: false,
        error:
          'Nâo é possível editar um MeetUp no qual você não é um organizador.',
      });
    }

    // Meetup is passed
    if (isBefore(meetup.date, new Date())) {
      return res.status(401).json({
        status: false,
        error: 'Nâo é possível deletar um MeetUp que já foi realizado.',
      });
    }

    meetup.destroy();

    return res.json({
      status: true,
      deleted: true,
    });
  }
}

export default new MeetupController();
