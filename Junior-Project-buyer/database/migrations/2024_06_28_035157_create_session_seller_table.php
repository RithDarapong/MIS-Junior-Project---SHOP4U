<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSessionSellerTable extends Migration
{
    public function up()
    {
        Schema::create('session_seller', function (Blueprint $table) {
            $table->id('session_id')->unsigned();
            $table->string('seller_id', 255)->nullable();
            $table->string('token', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('session_seller');
    }
}
