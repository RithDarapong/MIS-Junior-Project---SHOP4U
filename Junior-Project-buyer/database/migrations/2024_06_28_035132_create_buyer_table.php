<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBuyerTable extends Migration
{
    public function up()
    {
        Schema::create('buyer', function (Blueprint $table) {
            $table->id('buyer_id')->unsigned();
            $table->string('username', 255);
            $table->string('first_name', 255);
            $table->string('last_name', 255);
            $table->string('email', 255);
            $table->string('password', 255);
            $table->string('phone', 255);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('buyer');
    }
}
