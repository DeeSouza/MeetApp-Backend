import * as Yup from 'yup';
import { parseISO, isBefore, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  /**
   * @description List all meetups
   * @author Diego Souza
   * @param {*} req
   * @param {*} res
   */
  async index(req, res) {
    const { page = 1, date } = req.query;
    const dateFormat = date ? parseISO(date) : null;
    const limitNumber = 10;

    // Meetups from user logged
    const meetups = await Meetup.findAll({
      attributes: ['title', 'description', 'date', 'file_id', 'localization'],
      limit: limitNumber,
      offset: (page - 1) * 10,
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['name', 'email'],
        },
      ],
      where: dateFormat
        ? {
            date: {
              [Op.between]: [startOfDay(dateFormat), endOfDay(dateFormat)],
            },
          }
        : {},
    });

    if (!meetups.length) {
      return res.json({
        status: false,
        message: 'Nenhum Meetup encontrado!',
      });
    }

    return res.json(meetups);
  }

  /**
   * @description Show meetup
   * @author Diego Souza
   * @param {req} req
   * @param {res} res
   */
  async show(req, res) {
    const { id } = req.params;

    const meetup = await Meetup.findByPk(id, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['name', 'email'],
        },
        {
          model: File,
          as: 'files',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(meetup);
  }

  /**
   * @description Create new meetup
   * @author Diego Souza
   * @param {*} req
   * @param {*} res
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      date: Yup.date().required(),
      user_id: Yup.number().required(),
      localization: Yup.string().required(),
      file_id: Yup.number().required(),
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

  /**
   * @description Update meetup
   * @author Diego Souza
   * @param {*} req
   * @param {*} res
   */
  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      date: Yup.date().required(),
      user_id: Yup.number().required(),
      localization: Yup.string().required(),
      file_id: Yup.number().required(),
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

  /**
   * @description Destroy or delete meetup from platform
   * @author Diego Souza
   * @param {*} req
   * @param {*} res
   */
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
