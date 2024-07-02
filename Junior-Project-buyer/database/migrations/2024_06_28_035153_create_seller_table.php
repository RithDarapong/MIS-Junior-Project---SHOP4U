<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSellerTable extends Migration
{
    public function up()
    {
        Schema::create('seller', function (Blueprint $table) {
            $table->id('seller_id')->unsigned();
            $table->string('username', 255);
            $table->string('password', 255);
            $table->string('first_name', 255);
            $table->string('last_name', 255);
            $table->string('email', 255);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('seller');
    }
}
