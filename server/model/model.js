const { literal, DataTypes } = require("sequelize");
const sequelize = require("../../database/sequelize");

const express = require('express');
const router = express.Router();

// Assignment Table
const Assignment = sequelize.define(
    "Assignment",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        subject: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        assignor: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        topic: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        max_marks: {
            type: DataTypes.INTEGER(3)
        },
        start_dt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: literal('CURRENT_TIMESTAMP')
        },
        end_dt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        tableName: 'nb_assignments',
        timestamps: false
    });


// Subject Table
const Subject = sequelize.define('Subject', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    color: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    },
    {
        tableName: 'nb_notebooks',
        timestamps: false
    });

// Submission Table
const Submission = sequelize.define('Submission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subject: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    imageName: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    imageType: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    imageBase64: {
        type: DataTypes.BLOB('long'),
        allowNull: false
    },
    submitted: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('CURRENT_TIMESTAMP')
    },
    comments: {
        type: DataTypes.STRING(30),
    }
}, {
    tableName: 'nb_submissions',
    timestamps: false
});

Assignment.hasMany(Submission,{
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
    foreignKey: {
        name: "assignment_id",
        allowNull: false,
    }
});

Submission.belongsTo(Assignment,{
    foreignKey:{
        name: "assignment_id"
    }
});

// Feedback Table
const Feedback = sequelize.define('Feedback', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    assignment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    marks_obtained: {
        type: DataTypes.INTEGER,
    },
    feedback: {
        type: DataTypes.STRING(150),
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'nb_feedbacks',
    timestamps: false
});

Assignment.hasMany(Feedback, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
    foreignKey: {
        name: "assignment_id",
        allowNull: false,
    }
});

Feedback.belongsTo(Assignment, {
    foreignKey: {
        name: "assignment_id"
    }
});

//User Table
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    g_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    view: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    pic: {
        type: DataTypes.STRING(2083),
        allowNull: false
    },
    registered: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('CURRENT_TIMESTAMP')
    }
},{
    tableName: "nb_users",
    timestamps: false
});

sequelize.sync({ force: false }).then(() => {
    console.log('Table created successfully.');
}).catch((error) => {
    console.log('Error creating table:', error);
});

module.exports = router;