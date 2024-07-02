const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();

// Middleware to check for token cookie
const checkToken = (req, res, next) => {
    // Check if the request path is not "/login" and if there is a "token" cookie
    console.log("Token:", req.cookies.token);
    if (
        req.path !== "/login" &&
        req.path !== "/register" &&
        !req.cookies.token
    ) {
        return res
            .status(401)
            .json({ error: "Unauthorized", message: "Missing token" });
    }
    next();
};

// Apply middleware globally
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:5173"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkToken);

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

// Init upload
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
}).single("productImage");

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb("Error: Images only!");
    }
}

// MySQL connection setup
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "shop4u_tbl",
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL: ", err);
        return;
    }
    console.log("Connected to MySQL database");
});

const bcrypt = require("bcrypt");

// Login route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Email and password are required",
        });
    }

    // Check if the email exists and retrieve the hashed password
    connection.query(
        "SELECT * FROM seller WHERE email = ?",
        [email],
        async (error, results) => {
            if (error) {
                console.error("Error in SQL query: ", error);
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: "An internal server error occurred",
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    error: "Unauthorized",
                    message: "Invalid email or password",
                });
            }

            const user = results[0];
            const hashedPassword = user.password;

            // Compare the provided password with the hashed password
            const match = await bcrypt.compare(password, hashedPassword);
            if (!match) {
                return res.status(401).json({
                    error: "Unauthorized",
                    message: "Invalid email or password",
                });
            }

            // If login is successful, retrieve seller ID
            const userId = user.seller_id;

            // Generate a new session token
            const token =
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);

            // Save the session token in the database
            connection.query(
                "INSERT INTO session_seller (seller_id, token) VALUES (?, ?)",
                [userId, token],
                (err, result) => {
                    if (err) {
                        console.error("Error saving session token: ", err);
                        return res.status(500).json({
                            error: "Internal Server Error",
                            message: "An internal server error occurred",
                        });
                    }

                    // Set the token cookie and send a response
                    res.cookie("token", token, { httpOnly: false });
                    res.json({ message: "Logged in successfully" });
                }
            );
        }
    );
});

// Register route
app.post("/register", async (req, res) => {
    const {
        username,
        firstName,
        lastName,
        email,
        password,
        businessName,
        businessAddress,
        businessContact,
        businessHours,
    } = req.body;

    if (
        !username ||
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !businessName ||
        !businessAddress ||
        !businessContact ||
        !businessHours
    ) {
        return res
            .status(400)
            .json({ error: "Bad Request", message: "All fields are required" });
    }

    // Check if the email already exists
    connection.query(
        "SELECT * FROM seller WHERE email = ?",
        [email],
        async (error, results) => {
            if (error) {
                console.error("Error in SQL query: ", error);
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: "An internal server error occurred",
                });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    error: "Conflict",
                    message: "Email already exists",
                });
            }

            try {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert the new user into the database
                connection.query(
                    "INSERT INTO seller (username, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)",
                    [username, firstName, lastName, email, hashedPassword],
                    (err, result) => {
                        if (err) {
                            console.error("Error registering user: ", err);
                            return res.status(500).json({
                                error: "Internal Server Error",
                                message: "An internal server error occurred",
                            });
                        }

                        // Generate a new session token
                        const token =
                            Math.random().toString(36).substring(2, 15) +
                            Math.random().toString(36).substring(2, 15);
                        const userId = result.insertId; // get the ID of the inserted user

                        // Save the session token in the database
                        connection.query(
                            "INSERT INTO session_seller (seller_id, token) VALUES (?, ?)",
                            [userId, token],
                            (err, result) => {
                                if (err) {
                                    console.error(
                                        "Error creating session: ",
                                        err
                                    );
                                    return res.status(500).json({
                                        error: "Internal Server Error",
                                        message:
                                            "An internal server error occurred",
                                    });
                                }

                                // Set the token cookie and send a response
                                res.cookie("token", token, { httpOnly: false });

                                // Insert the business info into the Business table
                                connection.query(
                                    "INSERT INTO Business (seller_id, business_name, business_address, business_contact, business_hours) VALUES (?, ?, ?, ?, ?)",
                                    [
                                        userId,
                                        businessName,
                                        businessAddress,
                                        businessContact,
                                        businessHours,
                                    ],
                                    (err, result) => {
                                        if (err) {
                                            console.error(
                                                "Error adding business: ",
                                                err
                                            );
                                            return res.status(500).json({
                                                error: "Internal Server Error",
                                                message:
                                                    "An internal server error occurred",
                                            });
                                        }

                                        res.json({
                                            message:
                                                "User registered successfully",
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            } catch (err) {
                console.error("Error hashing password: ", err);
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: "An internal server error occurred",
                });
            }
        }
    );
});

// Route for getting seller information
app.get("/seller/info", (req, res) => {
    // Retrieve the token from the request cookies
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
        return res
            .status(401)
            .json({ error: "Unauthorized", message: "Missing token" });
    }

    // Query the session_seller table to find the seller_id associated with the token
    connection.query(
        "SELECT seller_id FROM session_seller WHERE token = ?",
        [token],
        (error, results) => {
            if (error) {
                console.error("Error in SQL query: ", error);
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: "An internal server error occurred",
                });
            }

            // Check if the token is valid
            if (results.length === 0) {
                return res
                    .status(401)
                    .json({ error: "Unauthorized", message: "Invalid token" });
            }

            const sellerId = results[0].seller_id;

            // Query the seller table to retrieve the seller information
            connection.query(
                "SELECT seller_id, username, first_name, last_name, email FROM seller WHERE seller_id = ?",
                [sellerId],
                (error, results) => {
                    if (error) {
                        console.error("Error in SQL query: ", error);
                        return res.status(500).json({
                            error: "Internal Server Error",
                            message: "An internal server error occurred",
                        });
                    }

                    // Check if the seller exists
                    if (results.length === 0) {
                        return res.status(404).json({
                            error: "Not Found",
                            message: "Seller not found",
                        });
                    }

                    // Send the seller information as a response
                    const seller = results[0];
                    res.json({
                        id: seller.seller_id,
                        username: seller.username,
                        firstName: seller.first_name,
                        lastName: seller.last_name,
                        email: seller.email,
                    });
                }
            );
        }
    );
});

// Route to get the business info by seller ID
app.get("/seller/business", (req, res) => {
    // Retrieve the token from the request cookies
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
        return res
            .status(401)
            .json({ error: "Unauthorized", message: "Missing token" });
    }

    // Query the session_seller table to find the seller_id associated with the token
    connection.query(
        "SELECT seller_id FROM session_seller WHERE token = ?",
        [token],
        (error, results) => {
            if (error) {
                console.error("Error in SQL query: ", error);
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: "An internal server error occurred",
                });
            }

            // Check if the token is valid
            if (results.length === 0) {
                return res
                    .status(401)
                    .json({ error: "Unauthorized", message: "Invalid token" });
            }

            const sellerId = results[0].seller_id;

            // Query the Business table to retrieve the business associated with the seller ID
            connection.query(
                "SELECT * FROM Business WHERE seller_id = ? LIMIT 1",
                [sellerId],
                (error, result) => {
                    if (error) {
                        console.error("Error in SQL query: ", error);
                        return res.status(500).json({
                            error: "Internal Server Error",
                            message: "An internal server error occurred",
                        });
                    }

                    // Check if the business exists
                    if (result.length === 0) {
                        return res.status(404).json({
                            error: "Not Found",
                            message: "Business not found",
                        });
                    }

                    // Send the business information as a response
                    res.json(result[0]);
                }
            );
        }
    );
});

// Route to update business info by seller ID
app.put("/seller/business", (req, res) => {
    // Retrieve the token from the request cookies
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
        return res
            .status(401)
            .json({ error: "Unauthorized", message: "Missing token" });
    }

    // Extract updated business information from request body
    const {
        business_id,
        seller_id,
        business_name,
        business_address,
        business_contact,
        business_hours,
    } = req.body;

    console.log("Token:", token);
    console.log("Request Body:", req.body);

    // Query the session_seller table to find the seller_id associated with the token
    connection.query(
        "SELECT seller_id FROM session_seller WHERE token = ?",
        [token],
        (error, results) => {
            if (error) {
                console.error("Error in SQL query: ", error);
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: "An internal server error occurred",
                });
            }

            // Check if the token is valid
            if (results.length === 0) {
                return res
                    .status(401)
                    .json({ error: "Unauthorized", message: "Invalid token" });
            }

            const sellerId = results[0].seller_id;

            console.log("Seller ID from Token:", sellerId);
            console.log("Seller ID from Request:", seller_id);

            // Check if the seller ID in the request matches the seller ID associated with the token
            if (seller_id != sellerId) {
                // Use != instead of !== to allow type coercion
                console.log("Seller ID Mismatch");
                return res.status(403).json({
                    error: "Forbidden",
                    message: "You are not authorized to update this business",
                });
            }

            // Update the business information
            connection.query(
                "UPDATE Business SET business_name = ?, business_address = ?, business_contact = ?, business_hours = ? WHERE business_id = ? AND seller_id = ?",
                [
                    business_name,
                    business_address,
                    business_contact,
                    business_hours,
                    business_id,
                    seller_id,
                ],
                (error, result) => {
                    if (error) {
                        console.error("Error updating business: ", error);
                        return res.status(500).json({
                            error: "Internal Server Error",
                            message: "An internal server error occurred",
                        });
                    }

                    // Check if the business was successfully updated
                    if (result.affectedRows === 0) {
                        return res.status(404).json({
                            error: "Not Found",
                            message: "Business not found",
                        });
                    }

                    // Send success response
                    res.json({
                        message: "Business information updated successfully",
                    });
                }
            );
        }
    );
});

// Route to create a product with image upload
app.post("/seller/product", (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res
            .status(401)
            .json({ error: "Unauthorized", message: "Missing token" });
    }

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                error: "Bad Request",
                message: err.message,
            });
        } else if (err) {
            return res.status(500).json({
                error: "Internal Server Error",
                message: "An internal server error occurred",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                error: "Bad Request",
                message: "No file selected",
            });
        }

        const { product_title, product_description, product_price } = req.body;

        connection.query(
            "SELECT seller_id FROM session_seller WHERE token = ?",
            [token],
            (error, results) => {
                if (error) {
                    console.error("Error in SQL query: ", error);
                    return res.status(500).json({
                        error: "Internal Server Error",
                        message: "An internal server error occurred",
                    });
                }

                if (results.length === 0) {
                    return res.status(401).json({
                        error: "Unauthorized",
                        message: "Invalid token",
                    });
                }

                const seller_id = results[0].seller_id;

                // Get the business_id associated with the seller_id
                connection.query(
                    "SELECT business_id FROM Business WHERE seller_id = ?",
                    [seller_id],
                    (error, results) => {
                        if (error) {
                            console.error("Error in SQL query: ", error);
                            return res.status(500).json({
                                error: "Internal Server Error",
                                message: "An internal server error occurred",
                            });
                        }

                        if (results.length === 0) {
                            return res.status(404).json({
                                error: "Not Found",
                                message: "Business not found for this seller",
                            });
                        }

                        const business_id = results[0].business_id;

                        // Insert the product into the Product table
                        connection.query(
                            "INSERT INTO Product (business_id, product_title, product_description, product_price, product_image) VALUES (?, ?, ?, ?, ?)",
                            [
                                business_id,
                                product_title,
                                product_description,
                                product_price,
                                req.file.path.replace(/\\/g, "/"), // Replace backslashes with forward slashes for URL
                            ],
                            (err, result) => {
                                if (err) {
                                    console.error(
                                        "Error creating product: ",
                                        err
                                    );
                                    return res.status(500).json({
                                        error: "Internal Server Error",
                                        message:
                                            "An internal server error occurred",
                                    });
                                }

                                res.json({
                                    message: "Product created successfully",
                                });
                            }
                        );
                    }
                );
            }
        );
    });
});

// Route to serve uploaded images
app.get("/uploads/:filename", (req, res) => {
    const filename = req.params.filename;
    res.sendFile(path.join(__dirname, "uploads", filename));
});

// Route to get product information by product ID
app.get("/product/:productId", (req, res) => {
    const productId = req.params.productId;

    connection.query(
        "SELECT * FROM Product WHERE product_id = ?",
        [productId],
        (error, results) => {
            if (error) {
                console.error("Error in SQL query: ", error);
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: "An internal server error occurred",
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    error: "Not Found",
                    message: "Product not found",
                });
            }

            res.json(results[0]); // Assuming product_id is unique, so only one result
        }
    );
});

// Route to update product information by product ID
app.put("/product/:productId", (req, res) => {
    const productId = req.params.productId;
    const { product_title, product_description, product_price } = req.body;

    // Retrieve the token from the request cookies
    const token = req.cookies.token;
    console.log(product_title);
    // Check if the token exists
    if (!token) {
        return res
            .status(401)
            .json({ error: "Unauthorized", message: "Missing token" });
    }

    // Check if all required fields are present
    if (!product_title || !product_description || !product_price) {
        return res
            .status(400)
            .json({ error: "Bad Request", message: "All fields are required" });
    }

    // Query the session_seller table to find the seller_id associated with the token
    connection.query(
        "SELECT seller_id FROM session_seller WHERE token = ?",
        [token],
        (error, results) => {
            if (error) {
                console.error("Error in SQL query: ", error);
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: "An internal server error occurred",
                });
            }

            // Check if the token is valid
            if (results.length === 0) {
                return res
                    .status(401)
                    .json({ error: "Unauthorized", message: "Invalid token" });
            }

            const sellerId = results[0].seller_id;

            // Query the Product table to check if the product exists and is owned by the seller
            connection.query(
                "SELECT * FROM Product WHERE product_id = ? AND EXISTS (SELECT 1 FROM Business WHERE Business.business_id = Product.business_id AND Business.seller_id = ?)",
                [productId, sellerId],
                (error, results) => {
                    if (error) {
                        console.error("Error in SQL query: ", error);
                        return res.status(500).json({
                            error: "Internal Server Error",
                            message: "An internal server error occurred",
                        });
                    }

                    // Check if the product exists
                    if (results.length === 0) {
                        return res.status(404).json({
                            error: "Not Found",
                            message:
                                "Product not found or not owned by the seller",
                        });
                    }

                    // Update the product information
                    connection.query(
                        "UPDATE Product SET product_title = ?, product_description = ?, product_price = ? WHERE product_id = ?",
                        [
                            product_title,
                            product_description,
                            product_price,
                            productId,
                        ],
                        (error, result) => {
                            if (error) {
                                console.error(
                                    "Error updating product: ",
                                    error
                                );
                                return res.status(500).json({
                                    error: "Internal Server Error",
                                    message:
                                        "An internal server error occurred",
                                });
                            }

                            // Check if the product was successfully updated
                            if (result.affectedRows === 0) {
                                return res.status(404).json({
                                    error: "Not Found",
                                    message: "Product not found",
                                });
                            }

                            // Send success response
                            res.json({
                                message:
                                    "Product information updated successfully",
                            });
                        }
                    );
                }
            );
        }
    );
});

// Route to delete product by product ID
app.delete("/product/:productId", (req, res) => {
    const productId = req.params.productId;

    // Retrieve the token from the request cookies
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
        return res
            .status(401)
            .json({ error: "Unauthorized", message: "Missing token" });
    }

    // Query the session_seller table to find the seller_id associated with the token
    connection.query(
        "SELECT seller_id FROM session_seller WHERE token = ?",
        [token],
        (error, results) => {
            if (error) {
                console.error("Error in SQL query: ", error);
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: "An internal server error occurred",
                });
            }

            // Check if the token is valid
            if (results.length === 0) {
                return res
                    .status(401)
                    .json({ error: "Unauthorized", message: "Invalid token" });
            }

            const sellerId = results[0].seller_id;

            // Query the Product table to check if the product exists and is owned by the seller
            connection.query(
                "SELECT * FROM Product WHERE product_id = ? AND EXISTS (SELECT 1 FROM Business WHERE Business.business_id = Product.business_id AND Business.seller_id = ?)",
                [productId, sellerId],
                (error, results) => {
                    if (error) {
                        console.error("Error in SQL query: ", error);
                        return res.status(500).json({
                            error: "Internal Server Error",
                            message: "An internal server error occurred",
                        });
                    }

                    // Check if the product exists
                    if (results.length === 0) {
                        return res.status(404).json({
                            error: "Not Found",
                            message:
                                "Product not found or not owned by the seller",
                        });
                    }

                    // Delete the product
                    connection.query(
                        "DELETE FROM Product WHERE product_id = ?",
                        [productId],
                        (error, result) => {
                            if (error) {
                                console.error(
                                    "Error deleting product: ",
                                    error
                                );
                                return res.status(500).json({
                                    error: "Internal Server Error",
                                    message:
                                        "An internal server error occurred",
                                });
                            }

                            // Check if the product was successfully deleted
                            if (result.affectedRows === 0) {
                                return res.status(404).json({
                                    error: "Not Found",
                                    message: "Product not found",
                                });
                            }

                            // Send success response
                            res.json({
                                message: "Product deleted successfully",
                            });
                        }
                    );
                }
            );
        }
    );
});

// Route to get products by seller's session
app.get("/products", (req, res) => {
    // Retrieve the token from the request cookies
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
        return res
            .status(401)
            .json({ error: "Unauthorized", message: "Missing token" });
    }

    // Query the session_seller table to find the seller_id associated with the token
    connection.query(
        "SELECT seller_id FROM session_seller WHERE token = ?",
        [token],
        (error, results) => {
            if (error) {
                console.error("Error in SQL query: ", error);
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: "An internal server error occurred",
                });
            }

            // Check if the token is valid
            if (results.length === 0) {
                return res
                    .status(401)
                    .json({ error: "Unauthorized", message: "Invalid token" });
            }

            const sellerId = results[0].seller_id;

            // Query the Business table to find the business_id associated with the seller_id
            connection.query(
                "SELECT business_id FROM Business WHERE seller_id = ?",
                [sellerId],
                (error, results) => {
                    if (error) {
                        console.error("Error in SQL query: ", error);
                        return res.status(500).json({
                            error: "Internal Server Error",
                            message: "An internal server error occurred",
                        });
                    }

                    // Check if the business exists
                    if (results.length === 0) {
                        return res.status(404).json({
                            error: "Not Found",
                            message: "Business not found for this seller",
                        });
                    }

                    const businessId = results[0].business_id;

                    // Query the Product table to retrieve products by business_id
                    connection.query(
                        "SELECT * FROM Product WHERE business_id = ?",
                        [businessId],
                        (error, results) => {
                            if (error) {
                                console.error("Error in SQL query: ", error);
                                return res.status(500).json({
                                    error: "Internal Server Error",
                                    message:
                                        "An internal server error occurred",
                                });
                            }

                            // Send the products as a response
                            res.json(results || []);
                        }
                    );
                }
            );
        }
    );
});

// Route to get order details by seller's session
app.get("/order_details", (req, res) => {
    // Retrieve the token from the request cookies
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
        return res
            .status(401)
            .json({ error: "Unauthorized", message: "Missing token" });
    }

    // Query the session_seller table to find the seller_id associated with the token
    connection.query(
        "SELECT seller_id FROM session_seller WHERE token = ?",
        [token],
        (error, results) => {
            if (error) {
                console.error("Error in SQL query: ", error);
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: "An internal server error occurred",
                });
            }

            // Check if the token is valid
            if (results.length === 0) {
                return res
                    .status(401)
                    .json({ error: "Unauthorized", message: "Invalid token" });
            }

            const sellerId = results[0].seller_id;

            // Query the Business table to find the business_id(s) associated with the seller_id
            connection.query(
                "SELECT business_id FROM Business WHERE seller_id = ?",
                [sellerId],
                (error, results) => {
                    if (error) {
                        console.error("Error in SQL query: ", error);
                        return res.status(500).json({
                            error: "Internal Server Error",
                            message: "An internal server error occurred",
                        });
                    }

                    // Check if the business exists
                    if (results.length === 0) {
                        return res.status(404).json({
                            error: "Not Found",
                            message: "Business not found for this seller",
                        });
                    }

                    // Extract business IDs
                    const businessIds = results.map(
                        (result) => result.business_id
                    );

                    // Query the Order Detail table to retrieve order details by business_id
                    connection.query(
                        "SELECT * FROM order_detail WHERE business_id IN (?)",
                        [businessIds],
                        (error, orderDetailResults) => {
                            if (error) {
                                console.error("Error in SQL query: ", error);
                                return res.status(500).json({
                                    error: "Internal Server Error",
                                    message:
                                        "An internal server error occurred",
                                });
                            }

                            // Get the buyer_ids from the order details
                            const buyerIds = orderDetailResults.map(
                                (result) => result.buyer_id
                            );

                            // Query the Buyer table to retrieve buyer details
                            connection.query(
                                "SELECT * FROM Buyer WHERE buyer_id IN (?)",
                                [buyerIds],
                                (error, buyerResults) => {
                                    if (error) {
                                        console.error(
                                            "Error in SQL query: ",
                                            error
                                        );
                                        return res.status(500).json({
                                            error: "Internal Server Error",
                                            message:
                                                "An internal server error occurred",
                                        });
                                    }

                                    // Query the Order Item table to retrieve order items by order detail IDs
                                    const orderDetailIds =
                                        orderDetailResults.map(
                                            (orderDetail) =>
                                                orderDetail.order_detail_id
                                        );
                                    connection.query(
                                        "SELECT * FROM Order_item WHERE order_detail_id IN (?)",
                                        [orderDetailIds],
                                        (error, orderItemResults) => {
                                            if (error) {
                                                console.error(
                                                    "Error in SQL query: ",
                                                    error
                                                );
                                                return res.status(500).json({
                                                    error: "Internal Server Error",
                                                    message:
                                                        "An internal server error occurred",
                                                });
                                            }

                                            // Get the product_ids from the order items
                                            const productIds =
                                                orderItemResults.map(
                                                    (result) =>
                                                        result.product_id
                                                );

                                            // Query the Product table to retrieve product details
                                            connection.query(
                                                "SELECT * FROM Product WHERE product_id IN (?)",
                                                [productIds],
                                                (error, productResults) => {
                                                    if (error) {
                                                        console.error(
                                                            "Error in SQL query: ",
                                                            error
                                                        );
                                                        return res
                                                            .status(500)
                                                            .json({
                                                                error: "Internal Server Error",
                                                                message:
                                                                    "An internal server error occurred",
                                                            });
                                                    }

                                                    // Combine order items with product details
                                                    const orderItemsWithProducts =
                                                        orderItemResults.map(
                                                            (orderItem) => {
                                                                const product =
                                                                    productResults.find(
                                                                        (
                                                                            product
                                                                        ) =>
                                                                            product.product_id ===
                                                                            orderItem.product_id
                                                                    );
                                                                return {
                                                                    ...orderItem,
                                                                    product:
                                                                        product ||
                                                                        {}, // If product not found, provide an empty object
                                                                };
                                                            }
                                                        );

                                                    // Combine order details with buyer details and order items with products
                                                    const orderDetailsWithBuyersAndProducts =
                                                        orderDetailResults.map(
                                                            (orderDetail) => {
                                                                const buyer =
                                                                    buyerResults.find(
                                                                        (
                                                                            buyer
                                                                        ) =>
                                                                            buyer.buyer_id ===
                                                                            orderDetail.buyer_id
                                                                    );
                                                                const orderItems =
                                                                    orderItemsWithProducts.filter(
                                                                        (
                                                                            orderItem
                                                                        ) =>
                                                                            orderItem.order_detail_id ===
                                                                            orderDetail.order_detail_id
                                                                    );
                                                                return {
                                                                    ...orderDetail,
                                                                    buyer:
                                                                        buyer ||
                                                                        {}, // If buyer not found, provide an empty object
                                                                    products:
                                                                        orderItems, // Include order items as products
                                                                };
                                                            }
                                                        );

                                                    // Send the order details with expanded buyer details and products as a response
                                                    res.json(
                                                        orderDetailsWithBuyersAndProducts
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

// Route to get individual order detail by order_detail_id
app.get("/order_detail/:order_detail_id", (req, res) => {
    // Retrieve the token from the request cookies
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
        return res
            .status(401)
            .json({ error: "Unauthorized", message: "Missing token" });
    }

    // Retrieve the order_detail_id from the request parameters
    const orderDetailId = req.params.order_detail_id;

    // Query the session_seller table to find the seller_id associated with the token
    connection.query(
        "SELECT seller_id FROM session_seller WHERE token = ?",
        [token],
        (error, results) => {
            if (error) {
                console.error("Error in SQL query: ", error);
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: "An internal server error occurred",
                });
            }

            // Check if the token is valid
            if (results.length === 0) {
                return res
                    .status(401)
                    .json({ error: "Unauthorized", message: "Invalid token" });
            }

            const sellerId = results[0].seller_id;

            // Query the Business table to find the business_id(s) associated with the seller_id
            connection.query(
                "SELECT business_id FROM Business WHERE seller_id = ?",
                [sellerId],
                (error, results) => {
                    if (error) {
                        console.error("Error in SQL query: ", error);
                        return res.status(500).json({
                            error: "Internal Server Error",
                            message: "An internal server error occurred",
                        });
                    }

                    // Check if the business exists
                    if (results.length === 0) {
                        return res.status(404).json({
                            error: "Not Found",
                            message: "Business not found for this seller",
                        });
                    }

                    // Extract business IDs
                    const businessIds = results.map(
                        (result) => result.business_id
                    );

                    // Query the Order Detail table to retrieve the individual order detail by order_detail_id and business_id
                    connection.query(
                        "SELECT * FROM order_detail WHERE order_detail_id = ? AND business_id IN (?)",
                        [orderDetailId, businessIds],
                        (error, orderDetailResults) => {
                            if (error) {
                                console.error("Error in SQL query: ", error);
                                return res.status(500).json({
                                    error: "Internal Server Error",
                                    message:
                                        "An internal server error occurred",
                                });
                            }

                            // Check if the order detail exists
                            if (orderDetailResults.length === 0) {
                                return res.status(404).json({
                                    error: "Not Found",
                                    message: "Order detail not found",
                                });
                            }

                            // Get the buyer_id from the order detail
                            const buyerId = orderDetailResults[0].buyer_id;

                            // Query the Buyer table to retrieve buyer details
                            connection.query(
                                "SELECT * FROM Buyer WHERE buyer_id = ?",
                                [buyerId],
                                (error, buyerResults) => {
                                    if (error) {
                                        console.error(
                                            "Error in SQL query: ",
                                            error
                                        );
                                        return res.status(500).json({
                                            error: "Internal Server Error",
                                            message:
                                                "An internal server error occurred",
                                        });
                                    }

                                    // Query the Order Item table to retrieve order items for the order detail
                                    connection.query(
                                        "SELECT * FROM Order_item WHERE order_detail_id = ?",
                                        [orderDetailId],
                                        (error, orderItemResults) => {
                                            if (error) {
                                                console.error(
                                                    "Error in SQL query: ",
                                                    error
                                                );
                                                return res.status(500).json({
                                                    error: "Internal Server Error",
                                                    message:
                                                        "An internal server error occurred",
                                                });
                                            }

                                            // Get the product_ids from the order items
                                            const productIds =
                                                orderItemResults.map(
                                                    (result) =>
                                                        result.product_id
                                                );

                                            // Query the Product table to retrieve product details
                                            connection.query(
                                                "SELECT * FROM Product WHERE product_id IN (?)",
                                                [productIds],
                                                (error, productResults) => {
                                                    if (error) {
                                                        console.error(
                                                            "Error in SQL query: ",
                                                            error
                                                        );
                                                        return res
                                                            .status(500)
                                                            .json({
                                                                error: "Internal Server Error",
                                                                message:
                                                                    "An internal server error occurred",
                                                            });
                                                    }

                                                    // Combine order items with product details
                                                    const orderItemsWithProducts =
                                                        orderItemResults.map(
                                                            (orderItem) => {
                                                                const product =
                                                                    productResults.find(
                                                                        (
                                                                            product
                                                                        ) =>
                                                                            product.product_id ===
                                                                            orderItem.product_id
                                                                    );
                                                                return {
                                                                    ...orderItem,
                                                                    product:
                                                                        product ||
                                                                        {}, // If product not found, provide an empty object
                                                                };
                                                            }
                                                        );

                                                    // Combine order detail with buyer details and order items with products
                                                    const orderDetailWithBuyerAndProducts =
                                                        {
                                                            ...orderDetailResults[0],
                                                            buyer:
                                                                buyerResults[0] ||
                                                                {}, // If buyer not found, provide an empty object
                                                            products:
                                                                orderItemsWithProducts, // Include order items as products
                                                        };

                                                    // Send the individual order detail with expanded buyer details and products as a response
                                                    res.json(
                                                        orderDetailWithBuyerAndProducts
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

// Route to edit an individual order item (e.g., modify quantity)
app.put("/order_item/:order_item_id", (req, res) => {
    // Retrieve the token from the request cookies
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
        return res
            .status(401)
            .json({ error: "Unauthorized", message: "Missing token" });
    }

    // Retrieve the order_item_id and the new quantity from the request parameters
    const orderItemId = req.params.order_item_id;
    const newQuantity = req.body.quantity; // Assuming the new quantity is sent in the request body

    // Query the session_seller table to find the seller_id associated with the token
    connection.query(
        "SELECT seller_id FROM session_seller WHERE token = ?",
        [token],
        (error, results) => {
            if (error) {
                console.error("Error in SQL query: ", error);
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: "An internal server error occurred",
                });
            }

            // Check if the token is valid
            if (results.length === 0) {
                return res
                    .status(401)
                    .json({ error: "Unauthorized", message: "Invalid token" });
            }

            const sellerId = results[0].seller_id;

            // Query the Order Item table to find the order item by order_item_id and ensure it belongs to the seller
            connection.query(
                "SELECT * FROM Order_item INNER JOIN order_detail ON Order_item.order_detail_id = order_detail.order_detail_id INNER JOIN Business ON order_detail.business_id = Business.business_id WHERE order_item_id = ? AND Business.seller_id = ?",
                [orderItemId, sellerId],
                (error, results) => {
                    if (error) {
                        console.error("Error in SQL query: ", error);
                        return res.status(500).json({
                            error: "Internal Server Error",
                            message: "An internal server error occurred",
                        });
                    }

                    // Check if the order item exists and belongs to the seller
                    if (results.length === 0) {
                        return res.status(404).json({
                            error: "Not Found",
                            message:
                                "Order item not found or does not belong to the seller",
                        });
                    }

                    // Update the quantity of the order item
                    connection.query(
                        "UPDATE Order_item SET quantity = ? WHERE order_item_id = ?",
                        [newQuantity, orderItemId],
                        (error, results) => {
                            if (error) {
                                console.error("Error in SQL query: ", error);
                                return res.status(500).json({
                                    error: "Internal Server Error",
                                    message:
                                        "An internal server error occurred",
                                });
                            }

                            // Send success response
                            res.json({
                                success: true,
                                message: "Order item updated successfully",
                            });
                        }
                    );
                }
            );
        }
    );
});

// Route to delete an individual order detail
app.delete("/order_detail/:order_detail_id", (req, res) => {
    // Retrieve the token from the request cookies
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
        return res
            .status(401)
            .json({ error: "Unauthorized", message: "Missing token" });
    }

    // Retrieve the order_detail_id from the request parameters
    const orderDetailId = req.params.order_detail_id;

    // Query the session_seller table to find the seller_id associated with the token
    connection.query(
        "SELECT seller_id FROM session_seller WHERE token = ?",
        [token],
        (error, results) => {
            if (error) {
                console.error("Error in SQL query: ", error);
                return res.status(500).json({
                    error: "Internal Server Error",
                    message: "An internal server error occurred",
                });
            }

            // Check if the token is valid
            if (results.length === 0) {
                return res
                    .status(401)
                    .json({ error: "Unauthorized", message: "Invalid token" });
            }

            const sellerId = results[0].seller_id;

            // Query the Order Detail table to ensure it belongs to the seller
            connection.query(
                "SELECT * FROM order_detail INNER JOIN Business ON order_detail.business_id = Business.business_id WHERE order_detail_id = ? AND Business.seller_id = ?",
                [orderDetailId, sellerId],
                (error, results) => {
                    if (error) {
                        console.error("Error in SQL query: ", error);
                        return res.status(500).json({
                            error: "Internal Server Error",
                            message: "An internal server error occurred",
                        });
                    }

                    // Check if the order detail exists and belongs to the seller
                    if (results.length === 0) {
                        return res.status(404).json({
                            error: "Not Found",
                            message:
                                "Order detail not found or does not belong to the seller",
                        });
                    }

                    // Delete the order detail
                    connection.query(
                        "DELETE FROM order_detail WHERE order_detail_id = ?",
                        [orderDetailId],
                        (error, results) => {
                            if (error) {
                                console.error("Error in SQL query: ", error);
                                return res.status(500).json({
                                    error: "Internal Server Error",
                                    message:
                                        "An internal server error occurred",
                                });
                            }

                            // Send success response
                            res.json({
                                success: true,
                                message: "Order detail deleted successfully",
                            });
                        }
                    );
                }
            );
        }
    );
});

// Your other routes...
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
