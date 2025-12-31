<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ApplicantController extends Controller
{
    /**
     * Store a newly created applicant in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_posting_id' => ['required', 'exists:job_postings,id'],
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'resume_path' => ['nullable', 'string', 'max:1000'],
            'resume' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'photo_path' => ['nullable', 'string', 'max:1000'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'address' => ['nullable', 'string', 'max:500'],
            'skills' => ['nullable', 'string'],
            'education' => ['nullable', 'string', 'max:255'],
        ]);

        // If resume file uploaded, store and override resume_path
        if ($request->hasFile('resume')) {
            $path = $request->file('resume')->store('resumes', 'public');
            $validated['resume_path'] = $path;
        }

        // If photo uploaded, store and override photo_path
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo')->store('photos', 'public');
            $validated['photo_path'] = $photo;
        }

        // Default status to Pending
        $validated['status'] = 'Pending';

        $applicant = Applicant::create($validated);

        return response()->json($applicant, 201);
    }
}