const { literal, DataTypes } = require("sequelize");
const sequelize = require("../../database/sequelize");

const express = require('express');
const router = express.Router();

// Assignment Table
const Assignment = sequelize.define(
    "Assignment",
    {
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
const Notebook = sequelize.define('Notebook', {
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    color: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    owner: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
    {
        tableName: 'nb_notebooks',
    });

// Submission Table
const Submission = sequelize.define('Submission', {
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

Assignment.hasMany(Submission, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
    foreignKey: {
        name: "assignment_id",
        allowNull: false,
    }
});

Submission.belongsTo(Assignment, {
    foreignKey: {
        name: "assignment_id"
    }
});

// Feedback Table
const Feedback = sequelize.define('Feedback', {
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
    }
}, {
    tableName: "nb_users",
    timestamps: true,
    updatedAt: false,
    createdAt: "registered"
});

//M-to-M relation table between nb_users and nb_notebooks
const UserNotebook = sequelize.define("UserNotebook", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    notebook_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Notebook,
            key: "id"
        }
    },
    role: {
        type: DataTypes.STRING(9),
        allowNull: false
    },
}, {
    tableName: "nb_user_notebook",
    timestamps: true,
    updatedAt: false
});

sequelize.sync({ force: false }).then(() => {
    console.log('Table created successfully.');
}).catch((error) => {
    console.log('Error creating table:', error);
});

module.exports = { User, Notebook, Assignment, Submission, UserNotebook, Feedback };