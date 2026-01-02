<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE department_approval_rules MODIFY COLUMN type ENUM('leave','overtime','reimburse','cuti','sakit','keperluan') NOT NULL");
            DB::statement("ALTER TABLE approval_requests MODIFY COLUMN type ENUM('leave','overtime','reimburse','cuti','sakit','keperluan') NOT NULL");
        }
        // For sqlite/pgsql, these enums may be represented as TEXT/CHECK constraints.
        // If needed, you can manually adjust via a dedicated migration per driver.
    }

    public function down(): void
    {
        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE department_approval_rules MODIFY COLUMN type ENUM('leave','overtime','reimburse') NOT NULL");
            DB::statement("ALTER TABLE approval_requests MODIFY COLUMN type ENUM('leave','overtime','reimburse') NOT NULL");
        }
    }
};