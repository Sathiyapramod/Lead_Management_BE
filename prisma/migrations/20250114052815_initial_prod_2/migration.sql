-- CreateEnum
CREATE TYPE "RoleId" AS ENUM ('manager', 'admin');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('KAM', 'lead', 'contact');

-- CreateEnum
CREATE TYPE "CallFreq" AS ENUM ('daily', 'weekly');

-- CreateEnum
CREATE TYPE "Contact_Roles" AS ENUM ('owner', 'general_manager', 'procurement', 'sales', 'chef');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('Created', 'Sent', 'Paid', 'Overdue');

-- CreateEnum
CREATE TYPE "Score" AS ENUM ('one', 'two', 'three', 'four', 'five');

-- CreateEnum
CREATE TYPE "Opp" AS ENUM ('new', 'won', 'lost');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Roles" NOT NULL,
    "time_id" INTEGER,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeZones" (
    "id" SERIAL NOT NULL,
    "timezone" TEXT NOT NULL,
    "time_diff" TEXT NOT NULL,

    CONSTRAINT "TimeZones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Managers" (
    "id" SERIAL NOT NULL,
    "mgr_name" TEXT NOT NULL,
    "role" "RoleId" NOT NULL,
    "phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leads" (
    "id" SERIAL NOT NULL,
    "lead_name" TEXT NOT NULL,
    "rest_name" TEXT NOT NULL,
    "rest_addr1" TEXT NOT NULL,
    "rest_addr2" TEXT,
    "phone" TEXT,
    "mgr_id" INTEGER NOT NULL,
    "lead_status" BOOLEAN NOT NULL,
    "call_freq" "CallFreq" NOT NULL,
    "last_call_date" TIMESTAMP(3),
    "orders_placed" INTEGER,
    "orders_done" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contacts" (
    "id" SERIAL NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "cnct_name" TEXT NOT NULL,
    "cnct_role" "Contact_Roles" NOT NULL,
    "cnct_info" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call_Logs" (
    "id" SERIAL NOT NULL,
    "sid" TEXT NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "from_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "recording_sid" TEXT,
    "recording_uri" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Call_Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoices" (
    "id" SERIAL NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "account_id" INTEGER,
    "invoice_num" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "InvoiceStatus" NOT NULL,
    "due_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "lead_id" INTEGER NOT NULL,
    "order_value" INTEGER NOT NULL,
    "placed_on" TIMESTAMP(3) NOT NULL,
    "closed_on" TIMESTAMP(3),
    "isCreated" BOOLEAN NOT NULL,
    "isApproved" BOOLEAN NOT NULL,
    "approved_on" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "TimeZones_timezone_key" ON "TimeZones"("timezone");

-- CreateIndex
CREATE INDEX "TimeZones_timezone_idx" ON "TimeZones"("timezone");

-- CreateIndex
CREATE INDEX "Managers_phone_idx" ON "Managers"("phone");

-- CreateIndex
CREATE INDEX "Leads_phone_idx" ON "Leads"("phone");

-- CreateIndex
CREATE INDEX "Leads_lead_name_idx" ON "Leads"("lead_name");

-- CreateIndex
CREATE INDEX "Contacts_phone_idx" ON "Contacts"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Call_Logs_sid_key" ON "Call_Logs"("sid");

-- CreateIndex
CREATE INDEX "Call_Logs_sid_idx" ON "Call_Logs"("sid");

-- CreateIndex
CREATE INDEX "Orders_created_at_idx" ON "Orders"("created_at");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_time_id_fkey" FOREIGN KEY ("time_id") REFERENCES "TimeZones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leads" ADD CONSTRAINT "Leads_mgr_id_fkey" FOREIGN KEY ("mgr_id") REFERENCES "Managers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call_Logs" ADD CONSTRAINT "Call_Logs_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "Leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
