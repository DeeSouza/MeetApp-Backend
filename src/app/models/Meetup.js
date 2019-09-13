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
        file_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'users' });
    this.belongsTo(models.File, { foreignKey: 'file_id', as: 'files' });
    this.hasMany(models.EnrolMeetup, {
      foreignKey: 'meetup_id',
      as: 'enrol_meetups',
    });
  }
}

export default Meetup;
