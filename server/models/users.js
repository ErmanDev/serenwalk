module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      profile_url: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: 'http://api.dicebear.com/7.x/lorelei/svg',
      },
    }, {
      tableName: 'Users',
      timestamps: false,
    });
  
    return Users; };