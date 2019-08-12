import * as Yup from 'yup';
import User from '../models/User';
import Meetup from '../models/Meetup';
import EnrolMeetup from '../models/EnrolMeetup';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        status: false,
        error: 'Valores de campos inválidos ou não preenchidos.',
      });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(401).json({
        status: false,
        error: 'Esse usuário já existe na plataforma.',
      });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        status: false,
        error: 'Valores de campos inválidos ou não preenchidos.',
      });
    }

    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res
          .status(400)
          .json({ status: false, error: 'Usuário já existe na plataforma.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res
        .status(400)
        .json({ status: false, error: 'Senhas não conferem.' });
    }

    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async meetups_owner(req, res) {
    // Meetups from user logged is owner
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

  async meetups_enrolled(req, res) {
    // Meetups from user logged is owner
    const meetups = await EnrolMeetup.findAll({
      user_id: req.userId,
      attributes: ['id', 'enrolled_at'],
      include: [
        {
          model: Meetup,
          as: 'meetups',
          attributes: [
            'title',
            'description',
            'date',
            'banner',
            'localization',
          ],
        },
      ],
    });

    if (!meetups.length) {
      return res.json({
        status: false,
        message: 'Você ainda não se inscreveu nenhum MeetUp!',
      });
    }

    return res.json(meetups);
  }
}

export default new UserController();
