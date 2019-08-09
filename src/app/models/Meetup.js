import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        localization: Sequelize.STRING,
        latitud: Sequelize.NUMBER,
        longitud: Sequelize.NUMBER,
        date: Sequelize.DATE,
        banner: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Meetup;
