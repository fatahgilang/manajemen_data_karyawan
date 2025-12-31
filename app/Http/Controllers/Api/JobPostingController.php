<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;

class JobPostingController extends Controller
{
    /**
     * Display a listing of the job postings.
     */
    public function index(Request $request)
    {
        // Optional filter: status
        $status = $request->query('status');
        $query = JobPosting::query();

        if ($status) {
            $query->where('status', $status);
        }

        $postings = $query->orderByDesc('created_at')->get();

        return response()->json($postings);
    }

    /**
     * Display a single job posting.
     */
    public function show(JobPosting $jobPosting)
    {
        return response()->json($jobPosting);
    }
}