<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBusinessTable extends Migration
{
    public function up()
    {
        Schema::create('business', function (Blueprint $table) {
            $table->id('business_id')->unsigned();
            $table->unsignedInteger('seller_id');
            $table->string('business_name', 255);
            $table->string('business_address', 255);
            $table->string('business_contact', 255);
            $table->string('business_hours', 255);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('business');
    }
}
