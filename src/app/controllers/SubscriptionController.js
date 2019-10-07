import { isBefore, format, isEqual } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Meetup from '../models/Meetup';
import User from '../models/User';
import SubscriptionMeetup from '../models/SubscriptionMeetup';
import Mail from '../../libs/Mail';

class SubscriptionController {
  /**
   * @description Enrol user than is logged in meetup
   * @author Diego Souza
   * @param {*} req
   * @param {*} res
   */
  async store(req, res) {
    const { meetup_id } = req.body;

    const meetup = await Meetup.findByPk(meetup_id, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['name', 'email'],
        },
      ],
    });

    // Meetup doesn't exists
    if (!meetup) {
      return res.status(401).json({
        status: false,
        error: 'Esse Meetup não existe.',
      });
    }

    // User logged is owner of Meetup
    if (meetup.user_id === req.userId) {
      return res.status(401).json({
        status: false,
        error:
          'Nâo é possível se isncrever em um MeetUp no qual você é um organizador.',
      });
    }

    // Meetup is passed
    if (isBefore(meetup.date, new Date())) {
      return res.status(401).json({
        status: false,
        error: 'Nâo é possível deletar um MeetUp que já foi realizado.',
      });
    }

    // Meetups from user logged
    const meetups_enrol = await SubscriptionMeetup.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          as: 'meetups',
          attributes: ['id', 'date'],
        },
      ],
    });

    // Check if user already enrolled this meetup
    const checkIsEnrol = meetups_enrol.filter(
      enrol => enrol.meetup_id === meetup_id
    );

    if (checkIsEnrol.length > 0) {
      return res.status(401).json({
        status: false,
        error: 'Você já está inscrito nesse MeetUp.',
      });
    }

    // Check if user is enrolled in the meetup in same date and hour
    const checkIsDate = meetups_enrol.filter(enrol =>
      isEqual(enrol.meetups.date, meetup.date)
    );

    if (checkIsDate.length > 0) {
      return res.status(401).json({
        status: false,
        error: 'Você já está inscrito em um MeetUp nesse mesmo horário.',
      });
    }

    const enrolled_at = new Date();
    const { id } = await SubscriptionMeetup.create({
      meetup_id,
      enrolled_at,
      user_id: req.userId,
    });

    // User logged
    const userLogged = await User.findByPk(req.userId);

    // TODO: Send mail to owner meetup with subscription
    await Mail.sendMail({
      to: `${meetup.users.name} <${meetup.users.email}>`,
      subject: `Inscrição Recebida - ${meetup.title}`,
      template: 'subscription',
      context: {
        year: new Date().getFullYear(),
        title: meetup.title,
        owner: meetup.users.name,
        user: {
          name: userLogged.name,
          email: userLogged.email,
          enrolled_at: format(enrolled_at, "dd 'de' MMMM', ás' H:mm'h'", {
            locale: pt,
          }),
        },
      },
    });

    return res.json({ id });
  }
}

export default new SubscriptionController();
