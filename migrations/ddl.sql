-- Users table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Users] (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100),
        email NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        createdAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        updatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
    )
END

-- Drivers table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Drivers]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Drivers] (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100),
        status NVARCHAR(20) NOT NULL DEFAULT 'available',
        createdAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        updatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
    )
END

-- Packages table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Packages]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Packages] (
        id INT IDENTITY(1,1) PRIMARY KEY,
        userId INT NOT NULL,
        description NVARCHAR(500),
        status NVARCHAR(50) NOT NULL DEFAULT 'pending',
        createdAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        updatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Packages_User FOREIGN KEY (userId) REFERENCES Users(id)
    )
END

-- Deliveries table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Deliveries]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Deliveries] (
        id INT IDENTITY(1,1) PRIMARY KEY,
        packageId INT NOT NULL UNIQUE,
        driverId INT NOT NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'in_transit',
        createdAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        updatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        assignmentCode INT NOT NULL DEFAULT 18,
        CONSTRAINT FK_Deliveries_Package FOREIGN KEY (packageId) REFERENCES Packages(id),
        CONSTRAINT FK_Deliveries_Driver FOREIGN KEY (driverId) REFERENCES Drivers(id)
    )
END

-- Indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Packages_User_Status' AND object_id = OBJECT_ID('Packages'))
BEGIN
    CREATE INDEX IDX_Packages_User_Status ON Packages(userId, status)
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IDX_Deliveries_Driver_CreatedAt' AND object_id = OBJECT_ID('Deliveries'))
BEGIN
    CREATE INDEX IDX_Deliveries_Driver_CreatedAt ON Deliveries(driverId, createdAt)
END
