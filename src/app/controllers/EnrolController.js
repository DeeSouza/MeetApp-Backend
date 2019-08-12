import { isBefore, parseISO, isEqual } from 'date-fns';
import Meetup from '../models/Meetup';
import EnrolMeetup from '../models/EnrolMeetup';

class EnrolController {
  async store(req, res) {
    const { meetup_id } = req.body;

    const meetup = await Meetup.findByPk(meetup_id);

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
    const meetups_enrol = await EnrolMeetup.findAll({
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

    const { id } = await EnrolMeetup.create({
      meetup_id,
      user_id: req.userId,
      enrolled_at: new Date(),
    });

    return res.json({ id });
  }
}

export default new EnrolController();
